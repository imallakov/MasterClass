from rest_framework import serializers
from .models import MasterClass, MasterClassSlot, MasterClassEnrollment


class MasterClassSlotSerializer(serializers.ModelSerializer):
    free_places = serializers.SerializerMethodField()

    class Meta:
        model = MasterClassSlot
        fields = ['id', 'masterclass', 'start', 'end', 'free_places']

    def get_free_places(self, obj):
        limit = obj.masterclass.participant_limit
        # Считаем все брони на этот слот со статусом pending или paid
        enrolled = obj.enrollments.filter(status__in=['pending', 'paid']).count()
        return max(0, limit - enrolled)


class MasterClassSerializer(serializers.ModelSerializer):
    slots = MasterClassSlotSerializer(many=True, read_only=True)

    class Meta:
        model = MasterClass
        fields = [
            'id', 'title', 'description', 'price', 'image', 'participant_limit', 'slots', 'created_at', 'updated_at'
        ]


class MasterClassEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterClassEnrollment
        fields = ['id', 'user', 'slot', 'status', 'created_at']
        read_only_fields = ['user', 'status', 'created_at']
