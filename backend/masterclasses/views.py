import ipaddress
import json
import time
import uuid
from decimal import Decimal

from django.conf import settings
from django.db.models import Sum, Prefetch
from django.http import StreamingHttpResponse
from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from yookassa import Configuration, Payment
from datetime import datetime, date
from calendar import monthrange
from collections import defaultdict
import re

from .models import MasterClass, MasterClassSlot, MasterClassEnrollment
from .serializers import (
    MasterClassSerializer,
    MasterClassSlotSerializer,
    MasterClassEnrollmentSerializer,
    UserEnrollmentSerializer,
    AdminMasterClassEnrollmentSerializer,
    PaymentCreateSerializer,
)


class PaginationClass(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'meta': {
                'count': self.page.paginator.count,  # Total number of items
                'next': self.get_next_link(),  # URL of the next page
                'previous': self.get_previous_link(),
                'current_page': self.page.number,  # Current page number
                'total_pages': self.page.paginator.num_pages,  # Total pages
            },
            'results': data  # Paginated results
        })


class MasterClassListCreateView(generics.ListCreateAPIView):
    queryset = MasterClass.objects.order_by("title").all()
    serializer_class = MasterClassSerializer
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = PaginationClass

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class CalendarMonthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Parse date parameter or use current month
        date_param = request.query_params.get('date')

        if date_param:
            # Validate format YYYY-MM
            if not re.match(r'^\d{4}-\d{1,2}$', date_param):
                return Response(
                    {"error": "Date format should be YYYY-MM or YYYY-M (e.g., 2025-06 or 2025-1)"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                year, month = map(int, date_param.split('-'))
                if not (1 <= month <= 12):
                    raise ValueError("Month must be between 1 and 12")
            except ValueError as e:
                return Response(
                    {"error": f"Invalid date: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Use current month
            now = datetime.now()
            year, month = now.year, now.month

        # Get date range for the month
        start_date = date(year, month, 1)
        _, last_day = monthrange(year, month)
        end_date = date(year, month, last_day)

        # Get all slots for the month with masterclass info
        slots = MasterClassSlot.objects.filter(
            start__date__gte=start_date,
            start__date__lte=end_date
        ).select_related('masterclass').order_by('start__date', 'masterclass__title')

        # Group by day
        days_data = defaultdict(list)
        has_masterclass_days = set()

        for slot in slots:
            day = slot.start.day
            has_masterclass_days.add(day)

            # Check if this masterclass is already added for this day
            masterclass_ids_for_day = [mc['id'] for mc in days_data[day]]
            if slot.masterclass.id not in masterclass_ids_for_day:
                days_data[day].append({
                    'id': slot.masterclass.id,
                    'title': slot.masterclass.title
                })

        # Convert to the desired format
        days_list = []
        for day in sorted(days_data.keys()):
            days_list.append({
                'day': day,
                'masterclasses': days_data[day]
            })

        response_data = {
            'year': year,
            'month': month,
            'has_masterclass': sorted(list(has_masterclass_days)),
            'days': days_list
        }

        return Response(response_data)


class MasterClassDetailUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MasterClass.objects.order_by("title").all()
    serializer_class = MasterClassSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class MasterClassSlotCreateView(generics.CreateAPIView):
    queryset = MasterClassSlot.objects.order_by("start__date").all()
    serializer_class = MasterClassSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class MasterClassSlotDeleteView(generics.DestroyAPIView):
    queryset = MasterClassSlot.objects.order_by("start__date").all()
    serializer_class = MasterClassSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class MasterClassEnrollmentCreateView(generics.CreateAPIView):
    queryset = MasterClassEnrollment.objects.order_by("-created_at").all()

    serializer_class = MasterClassEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        slot = serializer.validated_data["slot"]
        quantity = serializer.validated_data["quantity"]
        user = request.user

        # Check for existing enrollment
        if self.queryset.filter(user=user, slot=slot).exists():
            return Response(
                {"detail": "Вы уже записаны на этот слот мастер-класса."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check slot capacity
        participant_limit = slot.masterclass.participant_limit
        current_enrollments = (
                slot.enrollments.filter(status__in=["pending", "paid"]).aggregate(
                    total=Sum("quantity")
                )["total"]
                or 0
        )

        if current_enrollments + quantity > participant_limit:
            return Response(
                {"detail": "Нет свободных мест на этом слоте!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserEnrollmentsListView(generics.ListAPIView):
    serializer_class = UserEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = MasterClassEnrollment.objects.filter(
            user=self.request.user
        ).select_related("slot", "slot__masterclass")

        # **Check and update pending enrollments**
        self._update_pending_enrollments(queryset)

        return queryset

    def _update_pending_enrollments(self, queryset):
        """Check YooKassa status for pending enrollments and update if needed"""
        pending_enrollments = queryset.filter(
            status='pending',
            payment_id__isnull=False
        )

        for enrollment in pending_enrollments:
            try:
                # **Fetch payment status from YooKassa**
                yookassa_payment = Payment.find_one(enrollment.payment_id)

                # **Update enrollment status based on YooKassa response**
                if yookassa_payment.status == 'succeeded':
                    enrollment.status = 'paid'
                    enrollment.save()
                    print(f"Updated enrollment {enrollment.id} to 'paid' status")

                elif yookassa_payment.status == 'canceled':
                    enrollment.status = 'cancelled'
                    enrollment.save()
                    print(f"Updated enrollment {enrollment.id} to 'cancelled' status")

                # **Handle other statuses if needed**
                elif yookassa_payment.status in ['waiting_for_capture', 'pending']:
                    # Keep as pending - payment is still processing
                    continue

            except Exception as e:
                # **Log error but don't break the flow**
                print(f"Error checking payment status for enrollment {enrollment.id}: {str(e)}")
                # You might want to use proper logging here:
                # logger.error(f"Error checking payment status for enrollment {enrollment.id}: {str(e)}")
                continue


class AdminMasterClassEnrollmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminMasterClassEnrollmentSerializer

    def get_queryset(self):
        # Prefetch enrollments sorted by created_at (descending)
        enrollments_prefetch = Prefetch(
            "slots__enrollments",
            queryset=MasterClassEnrollment.objects.select_related(
                "user", "slot"
            ).order_by("-created_at"),
        )
        return MasterClass.objects.prefetch_related(enrollments_prefetch).order_by('title').all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


Configuration.configure(settings.YOOKASSA_SHOP_ID, settings.YOOKASSA_API_KEY)


class PaymentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        print(f"Payment Create Post data: {data}")
        user = request.user
        slot = MasterClassSlot.objects.get(id=data["slot_id"])
        masterclass = MasterClass.objects.get(id=data["masterclass_id"])
        quantity = int(data["quantity"])
        amount = masterclass.price * quantity
        # amount = amount + (amount / Decimal(100) * Decimal(3.5))
        # Validate quantity and capacity
        participant_limit = masterclass.participant_limit
        current_enrollments = (
                slot.enrollments.filter(status__in=["pending", "paid"]).aggregate(
                    total=Sum("quantity")
                )["total"]
                or 0
        )

        if current_enrollments + quantity > participant_limit:
            return Response(
                {"detail": "Нет свободных мест на этом слоте!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check for existing enrollment
        existing_enrollment = MasterClassEnrollment.objects.filter(
            user=user, slot=slot, status__in=["pending", "paid"]
        ).first()
        if existing_enrollment:
            return Response(
                {"detail": "Вы уже записаны на этот слот мастер-класса."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Use provided idempotency_key or generate a new one
        idempotency_key = data.get("idempotency_key") or str(uuid.uuid4())
        return_url = data.get("return_url") or "https://дворецмастеров.рф/"

        print("Payment Create Post idempotency key: {}".format(idempotency_key))
        print("Payment Create Post return url: {}".format(return_url))

        # Check if there's a failed/cancelled enrollment for retry
        enrollment = MasterClassEnrollment.objects.filter(
            user=user, slot=slot, status="cancelled", payment_id__isnull=False
        ).first()
        if not enrollment:
            # Create new enrollment
            enrollment = MasterClassEnrollment.objects.create(
                user=user, slot=slot, quantity=quantity, status="pending"
            )

        # Create YooKassa payment
        try:
            payment = Payment.create(
                {
                    "amount": {"value": str(amount), "currency": "RUB"},
                    "confirmation": {
                        "type": "redirect",
                        "return_url": return_url,
                    },
                    "capture": True,
                    "description": f"Оплата записи на мастеркласс {masterclass.title}",
                    "metadata": {
                        "enrollment_id": enrollment.id,
                        "user_id": user.id,
                        "masterclass_id": masterclass.id,
                        "slot_id": slot.id,
                    },
                    "receipt": {
                        "customer": {
                            "email": user.email,
                        },
                        "items": [
                            {
                                "description": f"Оплата записи на мастеркласс {masterclass.title}",
                                "quantity": str(quantity),
                                "amount": {"value": str(amount), "currency": "RUB"},
                                "vat_code": "1",
                                "payment_mode": "full_prepayment",
                                "payment_subject": "service"
                            },
                        ]
                    },
                },
                idempotency_key,
            )
            # Save payment ID to enrollment
            enrollment.payment_id = payment.id
            enrollment.status = "pending"  # Reset to pending for retry
            enrollment.save()
        except Exception as e:
            # logger.error(f"Payment creation failed: {str(e)}")
            enrollment.delete()
            return Response(
                {"detail": "Ошибка при создании платежа", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "confirmation_url": payment.confirmation.confirmation_url,
                "enrollment_id": enrollment.id,
                "idempotency_key": idempotency_key,
                "status": enrollment.status,
            },
            status=status.HTTP_201_CREATED,
        )


YOOKASSA_IPS = [
    ipaddress.ip_network("185.71.76.0/27"),
    ipaddress.ip_network("185.71.77.0/27"),
    ipaddress.ip_network("77.75.153.0/25"),
    ipaddress.ip_address("77.75.156.11"),
    ipaddress.ip_address("77.75.156.35"),
    ipaddress.ip_network("77.75.154.128/25"),
    ipaddress.ip_network("2a02:5180::/32"),
]


class PaymentWebhookView(APIView):
    permission_classes = []

    def post(self, request):
        # logger.info(f"Received payment webhook request: {request.data}")
        # print(f'Received payment webhook request: {request.data}')
        # Extract client IP, preferring X-Forwarded-For for ngrok/Docker
        client_ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
        if not client_ip:
            client_ip = request.META.get("HTTP_X_REAL_IP") or request.META.get(
                "REMOTE_ADDR", ""
            )
        # logger.info(f"IP Headers: REMOTE_ADDR={request.META.get('REMOTE_ADDR')}, X-Real-IP={request.META.get('HTTP_X_REAL_IP')}, X-Forwarded-For={request.META.get('HTTP_X_FORWARDED_FOR')}, All Headers={request.META}")
        # print(
        #     f"IP Headers: REMOTE_ADDR={request.META.get('REMOTE_ADDR')}, X-Real-IP={request.META.get('HTTP_X_REAL_IP')}, X-Forwarded-For={request.META.get('HTTP_X_FORWARDED_FOR')}, All Headers={request.META}")
        if not client_ip:
            # logger.error("No valid client IP found in request headers")
            print("No valid client IP found in request headers")
            return Response(
                {"detail": "Missing client IP"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ip_addr = ipaddress.ip_address(client_ip)
        except ValueError as e:
            # logger.error(f"Invalid IP address: {client_ip}, Error: {str(e)}")
            print(f"Invalid IP address: {client_ip}, Error: {str(e)}")
            return Response(
                {"detail": f"Invalid IP address: {client_ip}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if IP is in any YooKassa network or is a specific IP
        is_valid_ip = False
        for network in YOOKASSA_IPS:
            if isinstance(network, ipaddress.IPv4Network) or isinstance(
                    network, ipaddress.IPv6Network
            ):
                if ip_addr in network:
                    is_valid_ip = True
                    break
            elif isinstance(network, ipaddress.IPv4Address) or isinstance(
                    network, ipaddress.IPv6Address
            ):
                if ip_addr == network:
                    is_valid_ip = True
                    break

        if not is_valid_ip:
            # logger.error(f"IP {client_ip} not in YOOKASSA_IPS")
            print(f"IP {client_ip} not in YOOKASSA_IPS")
            return Response(
                {"detail": "Unauthorized IP address"}, status=status.HTTP_403_FORBIDDEN
            )

        try:
            event = request.data.get("event")
            payment = request.data.get("object")
            payment_id = payment.get("id")
            # logger.info(f"Processing event: {event}, payment_id: {payment_id}")
            print(f"Processing event: {event}, payment_id: {payment_id}")

            yookassa_payment = Payment.find_one(payment_id)
            # logger.info(f"YooKassa payment status: {yookassa_payment.status}")
            print(f"YooKassa payment status: {yookassa_payment.status}")
            if yookassa_payment.status != payment["status"]:
                # logger.error(f"Payment status mismatch: webhook={payment['status']}, API={yookassa_payment.status}")
                print(
                    f"Payment status mismatch: webhook={payment['status']}, API={yookassa_payment.status}"
                )
                return Response(
                    {"detail": "Payment status mismatch"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            enrollment = MasterClassEnrollment.objects.get(payment_id=payment_id)
            # logger.info(f"Found enrollment: {enrollment.id}, current status: {enrollment.status}")
            print(
                f"Found enrollment: {enrollment.id}, current status: {enrollment.status}"
            )

            if event == "payment.succeeded":
                enrollment.status = "paid"
            elif event == "payment.canceled":
                enrollment.status = "cancelled"
            else:
                # logger.warning(f"Unhandled event: {event}")
                print(f"Unhandled event: {event}")
                return Response(
                    {"detail": f"Unsupported event: {event}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            enrollment.save()
            # logger.info(f"Updated enrollment {enrollment.id} to status: {enrollment.status}")
            print(f"Updated enrollment {enrollment.id} to status: {enrollment.status}")
            # return Response(status=status.HTTP_200_OK)
        except MasterClassEnrollment.DoesNotExist:
            # logger.error(f"Enrollment not found for payment_id={payment_id}")
            print(f"Enrollment not found for payment_id={payment_id}")
            # return Response({'detail': 'Enrollment not found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # logger.error(f"Webhook processing failed: {str(e)}", exc_info=True)
            print(f"Webhook processing failed: {str(e)}", exc_info=True)
            # return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(status=status.HTTP_200_OK)


class PaymentStatusSSEView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = []  # Disable DRF content negotiation

    def get(self, request, enrollment_id):
        def event_stream():
            while True:
                try:
                    enrollment = MasterClassEnrollment.objects.get(
                        id=enrollment_id, user=request.user
                    )
                    yield f"data: {json.dumps({'status': enrollment.status})}\n\n"
                    # logger.info(f"SSE: Sent status {enrollment.status} for enrollment {enrollment_id}")
                    if enrollment.status in ["paid", "cancelled"]:
                        break
                    time.sleep(2)
                except MasterClassEnrollment.DoesNotExist:
                    yield f"data: {json.dumps({'status': 'not_found'})}\n\n"
                    # logger.error(f"SSE: Enrollment {enrollment_id} not found")
                    break
                except Exception as e:
                    # logger.error(f"SSE error for enrollment {enrollment_id}: {str(e)}")
                    yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n"
                    break

        response = StreamingHttpResponse(
            event_stream(), content_type="text/event-stream"
        )
        response["Cache-Control"] = "no-cache"
        response["X-Accel-Buffering"] = "no"  # Disable Nginx buffering for production
        return response
