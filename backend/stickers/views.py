from rest_framework import generics, permissions
from .models import StickerCategories, Sticker
from .serializers import StickerCategoriesSerializer, StickerSerializer


class StickerCategoriesListCreateView(generics.ListCreateAPIView):
    queryset = StickerCategories.objects.all()
    serializer_class = StickerCategoriesSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class StickerCategoriesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StickerCategories.objects.all()
    serializer_class = StickerCategoriesSerializer
    permission_classes = [permissions.IsAdminUser]


class StickerListCreateView(generics.ListCreateAPIView):
    queryset = Sticker.objects.all()
    serializer_class = StickerSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class StickerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sticker.objects.all()
    serializer_class = StickerSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
