from django.db.models import Sum
from rest_framework import generics, permissions, serializers, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import MasterClass, MasterClassSlot, MasterClassEnrollment
from .serializers import MasterClassSerializer, MasterClassSlotSerializer, MasterClassEnrollmentSerializer, \
    UserEnrollmentSerializer


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
