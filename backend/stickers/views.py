from django.db.models import Prefetch
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import StickerCategories, Sticker
from .serializers import StickerCategoriesSerializer, StickerSerializer, StickerCategoriesWithStickersSerializer


class StickerPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'meta': {
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
            },
            'results': data
        })


class StickerCategoriesListCreateView(generics.ListCreateAPIView):
    queryset = StickerCategories.objects.all()
    serializer_class = StickerCategoriesSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class StickerCategoriesDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StickerCategories.objects.prefetch_related('stickers')
    serializer_class = StickerCategoriesSerializer
    pagination_class = StickerPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def retrieve(self, request, *args, **kwargs):
        """Override GET to include paginated stickers"""
        instance = self.get_object()

        # Get stickers for this category
        stickers = instance.stickers.all().order_by('-created_at')

        # Apply pagination to stickers
        page = self.paginate_queryset(stickers)
        if page is not None:
            sticker_serializer = StickerSerializer(page, many=True, context={'request': request})
            paginated_stickers = self.get_paginated_response(sticker_serializer.data)

            # Combine category data with paginated stickers
            category_data = StickerCategoriesSerializer(instance).data
            return Response({
                'category': category_data,
                'stickers': paginated_stickers.data
            })

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class StickerListCreateView(generics.ListCreateAPIView):
    queryset = Sticker.objects.all()
    serializer_class = StickerSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def list(self, request, *args, **kwargs):
        """Override GET to return 5 categories with 10 stickers each - optimized"""
        # Get 5 categories with prefetch (but without slicing in Prefetch)
        categories = StickerCategories.objects.prefetch_related('stickers')[:5]

        serializer = StickerCategoriesWithStickersSerializer(
            categories, many=True, context={'request': request}
        )
        return Response(serializer.data)


class StickerAllListView(generics.ListAPIView):
    """Returns all stickers with pagination"""
    queryset = Sticker.objects.all().order_by('-created_at')
    serializer_class = StickerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StickerPagination


class StickerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sticker.objects.all()
    serializer_class = StickerSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
