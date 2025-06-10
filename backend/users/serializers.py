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

    birth_date = serializers.DateField(
        required=False,
        format="%d.%m.%Y",
        input_formats=["%d.%m.%Y"]
    )

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'birth_date', 'phone_number']
        extra_kwargs = {
            # 'full_name': {'required': False},
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
            # full_name=validated_data['full_name'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            birth_date=validated_data.get('birth_date', '01.01.1900'),
            phone_number=validated_data['phone_number'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    birth_date = serializers.DateField(
        format="%d.%m.%Y",
        input_formats=["%d.%m.%Y"],
        required=False
    )

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'phone_number_verified', 'first_name', 'last_name', 'birth_date', 'phone_number',
                  'is_active',
                  'is_staff', 'photo']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        read_only_fields = ['is_active', 'is_staff']


class UserDetailSerializer(serializers.ModelSerializer):
    birth_date = serializers.DateField(
        format="%d.%m.%Y",
        input_formats=["%d.%m.%Y"],
        required=False
    )

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'birth_date', 'is_active',
                  'phone_number_verified',
                  'is_staff', 'photo']
        read_only_fields = ['id', 'is_active', 'is_staff']

    def update(self, instance, validated_data):
        if 'photo' in validated_data:
            old_photo = instance.photo
            if old_photo:
                try:
                    old_photo.delete(save=False)
                except Exception:
                    # Log the error or handle it as needed
                    pass  # Continue with the update even if deletion fails

        return super().update(instance, validated_data)
