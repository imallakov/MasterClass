from rest_framework import serializers
from .models import StickerCategories, Sticker


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
