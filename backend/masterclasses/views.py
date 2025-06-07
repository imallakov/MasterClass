from django.db.models import Sum
from rest_framework import generics, permissions, serializers
from rest_framework.parsers import MultiPartParser, FormParser

from .models import MasterClass, MasterClassSlot, MasterClassEnrollment, GalleryImage
from .serializers import MasterClassSerializer, MasterClassSlotSerializer, MasterClassEnrollmentSerializer, \
    GalleryImageSerializer, UserEnrollmentSerializer


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

    def perform_create(self, serializer):
        slot = serializer.validated_data['slot']
        quantity = serializer.validated_data['quantity']
        participant_limit = slot.masterclass.participant_limit
        current_enrollments = slot.enrollments.filter(status__in=['pending', 'paid']).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        if current_enrollments + quantity > participant_limit:
            raise serializers.ValidationError('Нет свободных мест на этом слоте!')
        serializer.save(user=self.request.user)


class UserEnrollmentsListView(generics.ListAPIView):
    serializer_class = UserEnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MasterClassEnrollment.objects.filter(user=self.request.user).select_related('slot', 'slot__masterclass')


class GalleryImageListCreateView(generics.ListCreateAPIView):
    queryset = GalleryImage.objects.all().order_by('-uploaded_at')
    serializer_class = GalleryImageSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]  # только админ может загружать
        return [permissions.AllowAny()]


class GalleryImageDeleteView(generics.DestroyAPIView):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    permission_classes = [permissions.IsAdminUser]  # Только админ может удалять
