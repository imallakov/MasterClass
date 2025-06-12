from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from .models import StickerCategories, Sticker, StickerOrder


class StickerCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StickerCategories
        fields = ['id', 'title', 'description']


class StickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sticker
        fields = ['id', 'title', 'price', 'image', 'category', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def update(self, instance, validated_data):
        # Delete old image if new image is provided
        if 'image' in validated_data and instance.image:
            instance.image.delete(save=False)
        return super().update(instance, validated_data)


class StickerOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = StickerOrder
        fields = ['id', 'sticker', 'full_name', 'quantity', 'phone_number', 'created_at']
        read_only_fields = ['created_at']


class GroupedStickerOrderSerializer(serializers.Serializer):
    sticker = StickerSerializer()
    orders = serializers.SerializerMethodField()

    @extend_schema_field(StickerOrderSerializer(many=True))
    def get_orders(self, obj):
        # Access the custom 'orders' attribute set by Prefetch
        return StickerOrderSerializer(obj.orders, many=True).data
