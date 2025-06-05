from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .models import MasterClass, MasterClassSlot
from .serializers import MasterClassSerializer, MasterClassSlotSerializer


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
