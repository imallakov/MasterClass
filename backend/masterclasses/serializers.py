from rest_framework import serializers
from .models import MasterClass, MasterClassSlot


class MasterClassSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterClassSlot
        fields = ['id', 'masterclass', 'start', 'end']



class MasterClassSerializer(serializers.ModelSerializer):
    slots = MasterClassSlotSerializer(many=True, read_only=True)

    class Meta:
        model = MasterClass
        fields = [
            'id', 'title', 'description', 'price', 'image', 'participant_limit', 'slots', 'created_at', 'updated_at'
        ]
