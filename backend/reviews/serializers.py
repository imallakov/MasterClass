from rest_framework import serializers
from .models import Review
from django.contrib.auth import get_user_model

User = get_user_model()


class ReviewSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'full_name', 'rating', 'text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'full_name', 'created_at', 'updated_at']

    def get_full_name(self, obj) -> str:
        return obj.user.get_full_name()

    def create(self, validated_data):
        # Automatically set the user to the current authenticated user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
