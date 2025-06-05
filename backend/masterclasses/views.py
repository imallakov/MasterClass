from rest_framework import generics, permissions, serializers
from rest_framework.parsers import MultiPartParser, FormParser

from .models import MasterClass, MasterClassSlot, MasterClassEnrollment
from .serializers import MasterClassSerializer, MasterClassSlotSerializer, MasterClassEnrollmentSerializer


class MasterClassListCreateView(generics.ListCreateAPIView):
    queryset = MasterClass.objects.all()
    serializer_class = MasterClassSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class MasterClassDetailView(generics.RetrieveAPIView):
    queryset = MasterClass.objects.all()
    serializer_class = MasterClassSerializer
    permission_classes = [permissions.AllowAny]


class MasterClassSlotCreateView(generics.CreateAPIView):
    queryset = MasterClassSlot.objects.all()
    serializer_class = MasterClassSlotSerializer
    permission_classes = [permissions.IsAdminUser]


class MasterClassEnrollmentCreateView(generics.CreateAPIView):
    queryset = MasterClassEnrollment.objects.all()
    serializer_class = MasterClassEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        slot = serializer.validated_data['slot']
        participant_limit = slot.masterclass.participant_limit
        current_enrollments = slot.enrollments.filter(status__in=['pending', 'paid']).count()
        if current_enrollments >= participant_limit:
            raise serializers.ValidationError('Нет свободных мест на этом слоте!')
        serializer.save(user=self.request.user)
