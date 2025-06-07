from rest_framework import serializers

from .models import AboutUs


class AboutUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutUs
        fields = ['id', 'title', 'description', 'image', 'updated_at']
        read_only_fields = ['updated_at']

    def update(self, instance, validated_data):
        if 'image' in validated_data and instance.image:
            instance.image.delete(save=False)
        return super().update(instance, validated_data)
