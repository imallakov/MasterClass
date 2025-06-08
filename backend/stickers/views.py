from django.db.models import Prefetch
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response

from .models import StickerCategories, Sticker, StickerOrder
from .serializers import StickerCategoriesSerializer, StickerSerializer, StickerOrderSerializer, \
    GroupedStickerOrderSerializer


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

    def list(self, request, *args, **kwargs):
        # For GET requests, return grouped data
        stickers_with_orders = Sticker.objects.prefetch_related(
            Prefetch('stickerorder_set',
                     queryset=StickerOrder.objects.order_by('-created_at'),
                     to_attr='orders')
        ).filter(stickerorder__isnull=False).distinct()

        serializer = GroupedStickerOrderSerializer(stickers_with_orders, many=True)
        return Response(serializer.data)

    @extend_schema(
        responses={
            200: OpenApiResponse(response=GroupedStickerOrderSerializer(many=True)),
            201: OpenApiResponse(response=StickerOrderSerializer),
            400: OpenApiResponse(description="Bad Request"),
        },
        operation_id='list_or_create_orders',
        description="""
            GET: Returns all orders grouped by sticker, with each group's orders sorted newest to oldest.
            POST: Create a new sticker order (available to any user).
            """
    )
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    @extend_schema(
        request=StickerOrderSerializer,
        responses={
            201: StickerOrderSerializer,
            400: OpenApiResponse(description="Bad Request"),
        }
    )
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
