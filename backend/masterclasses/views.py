import ipaddress
import json
import time
import uuid

from django.conf import settings
from django.db.models import Sum, Prefetch
from django.http import StreamingHttpResponse
from rest_framework import generics, permissions, serializers, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from yookassa import Configuration, Payment

from .models import MasterClass, MasterClassSlot, MasterClassEnrollment
from .serializers import MasterClassSerializer, MasterClassSlotSerializer, MasterClassEnrollmentSerializer, \
    UserEnrollmentSerializer, AdminMasterClassEnrollmentSerializer, PaymentCreateSerializer


class MasterClassListCreateView(generics.ListCreateAPIView):
    queryset = MasterClass.objects.all()
    serializer_class = MasterClassSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class MasterClassDetailUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MasterClass.objects.all()
    serializer_class = MasterClassSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class MasterClassSlotCreateView(generics.CreateAPIView):
    queryset = MasterClassSlot.objects.all()
    serializer_class = MasterClassSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class MasterClassSlotDeleteView(generics.DestroyAPIView):
    queryset = MasterClassSlot.objects.all()
    serializer_class = MasterClassSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class MasterClassEnrollmentCreateView(generics.CreateAPIView):
    queryset = MasterClassEnrollment.objects.all()
    serializer_class = MasterClassEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        slot = serializer.validated_data['slot']
        quantity = serializer.validated_data['quantity']
        user = request.user

        # Check for existing enrollment
        if self.queryset.filter(user=user, slot=slot).exists():
            return Response(
                {'detail': 'Вы уже записаны на этот слот мастер-класса.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check slot capacity
        participant_limit = slot.masterclass.participant_limit
        current_enrollments = slot.enrollments.filter(
            status__in=['pending', 'paid']
        ).aggregate(total=Sum('quantity'))['total'] or 0

        if current_enrollments + quantity > participant_limit:
            return Response(
                {'detail': 'Нет свободных мест на этом слоте!'},
                status=status.HTTP_400_BAD_REQUEST
            )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserEnrollmentsListView(generics.ListAPIView):
    serializer_class = UserEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MasterClassEnrollment.objects.filter(user=self.request.user).select_related('slot', 'slot__masterclass')


class AdminMasterClassEnrollmentListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdminMasterClassEnrollmentSerializer

    def get_queryset(self):
        # Prefetch enrollments sorted by created_at (descending)
        enrollments_prefetch = Prefetch(
            'slots__enrollments',
            queryset=MasterClassEnrollment.objects.select_related('user', 'slot').order_by('-created_at')
        )
        return MasterClass.objects.prefetch_related(enrollments_prefetch).all()

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
        user = request.user
        slot = MasterClassSlot.objects.get(id=data['slot_id'])
        masterclass = MasterClass.objects.get(id=data['masterclass_id'])

        # Validate quantity and capacity
        participant_limit = masterclass.participant_limit
        current_enrollments = slot.enrollments.filter(
            status__in=['pending', 'paid']
        ).aggregate(total=Sum('quantity'))['total'] or 0

        if current_enrollments + data['quantity'] > participant_limit:
            return Response(
                {'detail': 'Нет свободных мест на этом слоте!'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check for existing enrollment
        existing_enrollment = MasterClassEnrollment.objects.filter(
            user=user, slot=slot, status__in=['pending', 'paid']
        ).first()
        if existing_enrollment:
            return Response(
                {'detail': 'Вы уже записаны на этот слот мастер-класса.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Use provided idempotency_key or generate a new one
        idempotency_key = data.get('idempotency_key') or str(uuid.uuid4())
        return_url = data.get('return_url') or 'https://дворецмастеров.рф/'

        # Check if there's a failed/cancelled enrollment for retry
        enrollment = MasterClassEnrollment.objects.filter(
            user=user, slot=slot, status='cancelled', payment_id__isnull=False
        ).first()
        if not enrollment:
            # Create new enrollment
            enrollment = MasterClassEnrollment.objects.create(
                user=user,
                slot=slot,
                quantity=data['quantity'],
                status='pending'
            )

        # Create YooKassa payment
        try:
            payment = Payment.create({
                "amount": {
                    "value": str(data['amount']),
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": return_url,
                },
                "capture": True,
                "description": f"Payment for {masterclass.title}",
                "metadata": {
                    "enrollment_id": enrollment.id,
                    "user_id": user.id,
                    "masterclass_id": masterclass.id,
                    "slot_id": slot.id
                }
            }, idempotency_key)
            # Save payment ID to enrollment
            enrollment.payment_id = payment.id
            enrollment.status = 'pending'  # Reset to pending for retry
            enrollment.save()
        except Exception as e:
            # logger.error(f"Payment creation failed: {str(e)}")
            return Response(
                {'detail': 'Ошибка при создании платежа', 'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "confirmation_url": payment.confirmation.confirmation_url,
            "enrollment_id": enrollment.id,
            "idempotency_key": idempotency_key,
            "status": enrollment.status
        }, status=status.HTTP_201_CREATED)


YOOKASSA_IPS = [
    ipaddress.ip_network('185.71.76.0/27'),
    ipaddress.ip_network('185.71.77.0/27'),
    ipaddress.ip_network('77.75.153.0/25'),
    ipaddress.ip_address('77.75.156.11'),
    ipaddress.ip_address('77.75.156.35'),
    ipaddress.ip_network('77.75.154.128/25'),
    ipaddress.ip_network('2a02:5180::/32'),
]


class PaymentWebhookView(APIView):
    permission_classes = []

    def post(self, request):
        # logger.info(f"Received webhook: {request.data}")
        client_ip = request.META.get('REMOTE_ADDR')
        if not any(ipaddress.ip_address(client_ip) in network for network in YOOKASSA_IPS):
            return Response({'detail': 'Invalid IP address'}, status=status.HTTP_403_FORBIDDEN)

        try:
            event = request.data.get('event')
            payment = request.data.get('object')
            payment_id = payment.get('id')

            # Verify payment status with YooKassa API
            yookassa_payment = Payment.find_one(payment_id)
            if yookassa_payment.status != payment['status']:
                return Response({'detail': 'Payment status mismatch'}, status=status.HTTP_400_BAD_REQUEST)

            enrollment = MasterClassEnrollment.objects.get(payment_id=payment_id)
            if event == 'payment.succeeded':
                enrollment.status = 'paid'
            elif event == 'payment.canceled':
                enrollment.status = 'cancelled'
            enrollment.save()
            return Response(status=status.HTTP_200_OK)
        except (MasterClassEnrollment.DoesNotExist, Exception) as e:
            # logger.error(f"Webhook processing failed: {str(e)}")
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentStatusSSEView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, enrollment_id):
        def event_stream():
            while True:
                try:
                    enrollment = MasterClassEnrollment.objects.get(id=enrollment_id, user=request.user)
                    yield f"data: {json.dumps({'status': enrollment.status})}\n\n"
                    if enrollment.status in ['paid', 'cancelled']:
                        break
                    time.sleep(2)
                except MasterClassEnrollment.DoesNotExist:
                    yield f"data: {json.dumps({'status': 'not_found'})}\n\n"
                    break

        response = StreamingHttpResponse(
            event_stream(), content_type='text/event-stream'
        )
        response['Cache-Control'] = 'no-cache'
        return response
