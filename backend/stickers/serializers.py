from rest_framework import serializers
from .models import StickerCategories, Sticker


class StickerCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = StickerCategories
        fields = ['id', 'title', 'description']


class StickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sticker
        fields = ['id', 'title', 'price', 'image', 'category', 'wb_link', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def update(self, instance, validated_data):
        # Delete old image if new image is provided
        if 'image' in validated_data and instance.image:
            instance.image.delete(save=False)
        return super().update(instance, validated_data)


class StickerCategoriesWithStickersSerializer(serializers.ModelSerializer):
    stickers = serializers.SerializerMethodField()

    class Meta:
        model = StickerCategories
        fields = ['id', 'title', 'description', 'stickers']

    def get_stickers(self, obj):
        # Get first 10 stickers for this category
        stickers = obj.stickers.all()[:10]
        return StickerSerializer(stickers, many=True, context=self.context).data
