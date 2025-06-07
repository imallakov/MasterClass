from django.contrib.auth import get_user_model
from rest_framework import permissions


class IsOwnerAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, get_user_model()):
            # Allow owners, admins to edit user
            if obj == request.user:
                return True
            return request.user.is_staff
        return False


class IsAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff
