from rest_framework import generics, permissions

from .models import GalleryImage
from .serializers import GalleryImageSerializer


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
