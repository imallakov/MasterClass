from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'password_confirm', 'full_name', 'phone_number']
        extra_kwargs = {
            'full_name': {'required': False},
            'phone_number': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        # Remove password_confirm from the data
        validated_data.pop('password_confirm')

        # Create user instance
        user = get_user_model().objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'phone_number_verified', 'full_name', 'phone_number', 'is_active', 'is_staff', 'photo']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        read_only_fields = ['is_active', 'is_staff']


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'full_name', 'phone_number', 'is_active', 'phone_number_verified', 'is_staff', 'photo']
        read_only_fields = ['id', 'is_active', 'is_staff']
