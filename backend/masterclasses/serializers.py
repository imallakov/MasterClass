from django.db.models import Sum
from rest_framework import serializers
from .models import MasterClass, MasterClassSlot, MasterClassEnrollment, GalleryImage


class MasterClassSlotSerializer(serializers.ModelSerializer):
    free_places = serializers.SerializerMethodField()

    class Meta:
        model = MasterClassSlot
        fields = ['id', 'masterclass', 'start', 'end', 'free_places']

    def get_free_places(self, obj):
        limit = obj.masterclass.participant_limit
        # Sum up all quantities, not just count records
        enrolled = obj.enrollments.filter(status__in=['pending', 'paid']).aggregate(
            total=Sum('quantity')
        )['total'] or 0
        return max(0, limit - enrolled)


class MasterClassSerializer(serializers.ModelSerializer):
    slots = MasterClassSlotSerializer(many=True, read_only=True)

    class Meta:
        model = MasterClass
        fields = [
            'id', 'title', 'description', 'price', 'image', 'participant_limit', 'slots', 'created_at', 'updated_at'
        ]

    def update(self, instance, validated_data):
        if 'photo' in validated_data:
            old_image = instance.image
            if old_image:
                try:
                    old_image.delete(save=False)
                except Exception:
                    # Log the error or handle it as needed
                    pass  # Continue with the update even if deletion fails

        return super().update(instance, validated_data)


class MasterClassEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterClassEnrollment
        fields = ['id', 'user', 'slot', 'quantity', 'status', 'created_at']
        read_only_fields = ['user', 'status', 'created_at']


class UserEnrollmentSerializer(serializers.ModelSerializer):
    slot = MasterClassSlotSerializer(read_only=True)
    masterclass = serializers.SerializerMethodField()

    class Meta:
        model = MasterClassEnrollment
        fields = ['id', 'slot', 'masterclass', 'quantity', 'status', 'created_at']

    def get_masterclass(self, obj):
        return MasterClassSerializer(obj.slot.masterclass).data


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'uploaded_at']
