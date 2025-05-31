from datetime import timedelta

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now


class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone_number, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not phone_number:
            raise ValueError('The Phone Number field must be set')
        email = self.normalize_email(email)
        phone_number = phone_number.strip()
        user = self.model(email=email, phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, phone_number, password, **extra_fields)


class User(AbstractUser):
    username = None
    full_name = models.TextField(blank=True, null=True)
    email = models.EmailField('email address', unique=True, blank=False, null=False)
    phone_number = models.CharField(max_length=11, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    phone_number_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []

    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()  # Assigning custom manager

    def __str__(self):
        return self.email

    class Meta:  # Optional Meta class
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['id']


def get_expiration_time():
    return now() + timedelta(minutes=15)


class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="otps")
    otp = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=[('reset', 'Password Reset'), ('verify', 'Phone Verification')])
    expiration_time = models.DateTimeField(default=get_expiration_time)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        return now() < self.expiration_time and not self.is_used
