from rest_framework import generics, permissions, viewsets
from .models import StickerCategories, Sticker, StickerOrder
from .serializers import StickerCategoriesSerializer, StickerSerializer, StickerOrderSerializer


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


class StickerOrderView(generics.ListCreateAPIView):
    queryset = StickerOrder.objects.all()
    serializer_class = StickerOrderSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
