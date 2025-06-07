from datetime import datetime, timezone

from django.conf import settings
from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotAuthenticated
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .permissions import IsOwnerAdmin, IsAdmin
from .serializers import UserRegistrationSerializer, UserSerializer, UserDetailSerializer

secure_cookie = settings.DEBUG is False


class RegisterView(APIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'User registered successfully.'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Validate user credentials and generate tokens
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get the validated user
        user = serializer.user

        # Check if the user is active
        if not user.is_active:
            raise PermissionDenied("Your account is inactive. Please contact support.")

        # Call the parent method to generate tokens
        response = super().post(request, *args, **kwargs)

        # Retrieve the refresh token from the response
        refresh_token = response.data['refresh']
        response.data.pop('refresh', None)

        # Get or generate CSRF token
        csrf_token = get_token(request)

        # Calculate cookie expiry to match token lifetime
        expiry = datetime.now(timezone.utc) + settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME')

        # Set HttpOnly cookie for refresh token
        response.set_cookie(
            key='refreshToken',
            value=refresh_token,
            httponly=True,  # Set to True for security
            secure=secure_cookie,  # Use secure cookies in production
            samesite='Lax',
            expires=expiry
        )

        # Set CSRF token cookie
        response.set_cookie(
            key='csrftoken',
            value=csrf_token,
            httponly=False,  # Must be accessible by JS
            secure=secure_cookie,
            samesite='Lax'
        )

        # Serialize the user object and add to response
        user_serializer = UserSerializer(user)
        response.data['user'] = user_serializer.data
        # logger.info(f"User logged in: {user_serializer.data.email}")
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refreshToken')

        if not refresh_token:
            return Response({'message': 'Refresh token not found'}, status=401)

        # print('✅ Received REFRESH TOKEN:', refresh_token)

        try:
            # Ensure request data is mutable
            request._full_data = {'refresh': refresh_token}  # ✅ Correct way to override request data

            # print('✅ Request data before sending to super():', request._full_data)

            response = super().post(request, *args, **kwargs)

            # print('✅ Response data:', response.data)

            # Handle refresh token rotation if enabled
            if 'refresh' in response.data:
                expiry = datetime.now(timezone.utc) + settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME')

                response.delete_cookie('refreshToken')  # Delete old token first
                response.set_cookie(
                    key='refreshToken',
                    value=response.data['refresh'],
                    httponly=True,
                    secure=secure_cookie,  # Ensure HTTPS is used
                    samesite='Lax',
                    expires=expiry
                )

                del response.data['refresh']

            csrf_token = get_token(request)
            response.set_cookie(
                key='csrftoken',
                value=csrf_token,
                httponly=False,  # ✅ Accessible by frontend
                secure=secure_cookie,
                samesite='Lax'
            )

            return response

        except Exception as e:
            # print(f"❌ Exception occurred: {e}")
            return Response({'message': 'Invalid refresh token'}, status=401)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.COOKIES.get('refreshToken')

        if not refresh_token:
            return Response({'message': 'No refresh token provided.'}, status=401)

        try:
            RefreshToken(refresh_token).blacklist()

            response = Response({'message': 'Successfully logged out.'}, status=200)
            response.delete_cookie('refreshToken')
            response.delete_cookie('csrftoken')

            return response

        except Exception as e:
            return Response({'message': 'Invalid refresh token.'}, status=401)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    """
    Handles retrieving, updating, and deleting user details.
    """
    permission_classes = [IsOwnerAdmin]
    serializer_class = UserDetailSerializer

    def get_object(self):
        user = self.request.user
        if user.is_authenticated:
            # Allow admins users to access any user
            if user.is_staff and 'pk' in self.kwargs:
                return get_user_model().objects.get(pk=self.kwargs['pk'])
            # Otherwise, return only the authenticated user's object
            return get_user_model().objects.get(pk=user.id)
        else:
            raise NotAuthenticated("User is not authenticated.")


class UserListView(ListAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAdmin]
