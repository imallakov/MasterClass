from datetime import datetime, timezone

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.signing import TimestampSigner, BadSignature
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotAuthenticated, ValidationError
from rest_framework.generics import RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import OTP
from .permissions import IsOwnerAdmin, IsAdmin
from .serializers import UserRegistrationSerializer, UserSerializer, UserDetailSerializer, PasswordUpdateSerializer
from .utils import generate_otp, StandardResponse

secure_cookie = settings.DEBUG is False

User = get_user_model()


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


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return StandardResponse.error(
                "Email is required.",
                {"email": ["This field is required."]}
            )

        # Rate limiting by email
        # rate_allowed, retry_after = RateLimiter.check_rate_limit(
        #     identifier=email,
        #     limit=3,  # 3 attempts per 5 minutes
        #     window=300,
        #     action_type="password_reset_request"
        # )

        # if not rate_allowed:
        #     return StandardResponse.rate_limit_error(retry_after)

        # Always return success to prevent user enumeration
        # But only send OTP if user exists
        try:
            user = User.objects.get(email=email)
            generate_otp(user, 'password_reset')
        except User.DoesNotExist:
            # Don't reveal that user doesn't exist
            pass

        return StandardResponse.success(
            "If an account with this email exists, an OTP has been sent.",
            {"email": email}
        )


class PasswordResetValidateOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp')

        if not email or not otp_code:
            return StandardResponse.error(
                "Email and OTP are required.",
                {
                    "email": ["This field is required."] if not email else [],
                    "otp": ["This field is required."] if not otp_code else []
                }
            )

        # Rate limiting by email
        # rate_allowed, retry_after = RateLimiter.check_rate_limit(
        #     identifier=email,
        #     limit=5,  # 5 attempts per 5 minutes
        #     window=300,
        #     action_type="otp_validation"
        # )
        #
        # if not rate_allowed:
        #     return StandardResponse.rate_limit_error(retry_after)

        try:
            user = User.objects.get(email=email)
            otp = OTP.objects.get(user=user, otp=otp_code, purpose='password_reset', is_used=False)

            if not otp.is_valid():
                return StandardResponse.error(
                    "Invalid or expired OTP.",
                    {"otp": ["The OTP has expired or has already been used."]}
                )

            # Generate a temporary signed token with 5-minute expiry
            signer = TimestampSigner()
            temp_token = signer.sign(user.id)

            # Mark the OTP as used
            otp.is_used = True
            otp.save()

            return StandardResponse.success(
                "OTP validated successfully.",
                {
                    "temp_token": temp_token,
                    "expires_in": 300  # 5 minutes
                }
            )

        except (User.DoesNotExist, OTP.DoesNotExist):
            # Generic error message to prevent enumeration
            return StandardResponse.error(
                "Invalid OTP. Please check and try again.",
                {"otp": ["The provided OTP is invalid."]}
            )


class PasswordResetConfirmView(APIView):
    def post(self, request):
        temp_token = request.data.get('temp_token')
        new_password = request.data.get('password')

        if not temp_token or not new_password:
            return StandardResponse.error(
                "Token and password are required.",
                {
                    "temp_token": ["This field is required."] if not temp_token else [],
                    "password": ["This field is required."] if not new_password else []
                }
            )

        # Rate limiting by IP (since we don't have user context yet)
        # client_ip = RateLimiter.get_client_ip(request)
        # rate_allowed, retry_after = RateLimiter.check_rate_limit(
        #     identifier=client_ip,
        #     limit=10,  # 10 attempts per 5 minutes per IP
        #     window=300,
        #     action_type="password_confirm"
        # )
        #
        # if not rate_allowed:
        #     return StandardResponse.rate_limit_error(retry_after)

        try:
            # Verify the temporary token (5-minute expiry)
            signer = TimestampSigner()
            user_id = signer.unsign(temp_token, max_age=300)

            # Retrieve the user
            user = User.objects.get(id=user_id)

            # Validate the new password
            validate_password(new_password, user=user)

            # Set and save the new password
            user.set_password(new_password)
            user.save()

            return StandardResponse.success(
                "Password has been reset successfully.",
                {
                    "user_id": user.id,
                    "reset_timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except BadSignature:
            return StandardResponse.error(
                "Invalid or expired reset token.",
                {"temp_token": ["The reset token is invalid or has expired."]}
            )
        except User.DoesNotExist:
            return StandardResponse.error(
                "Invalid reset token.",
                {"temp_token": ["The reset token is invalid."]}
            )
        except ValidationError as e:
            return StandardResponse.error(
                "Password validation failed.",
                {"password": e.messages}
            )


class EmailVerificationRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')

        if not email:
            return StandardResponse.error(
                "Email is required.",
                {"email": ["This field is required."]}
            )

        # Rate limiting by email
        # rate_allowed, retry_after = RateLimiter.check_rate_limit(
        #     identifier=email,
        #     limit=3,  # 3 attempts per 10 minutes
        #     window=600,
        #     action_type="email_verification_request"
        # )
        #
        # if not rate_allowed:
        #     return StandardResponse.rate_limit_error(retry_after)

        # Always return success to prevent user enumeration
        # But only send OTP if user exists and isn't verified
        try:
            user = User.objects.get(email=email)
            if not user.email_verified:
                generate_otp(user, 'email_verification')
            # If already verified, we still return success but don't send OTP
        except User.DoesNotExist:
            # Don't reveal that user doesn't exist
            pass

        return StandardResponse.success(
            "If your email requires verification, a verification code has been sent.",
            {"email": email}
        )


class EmailVerificationConfirmView(APIView):
    def post(self, request):
        otp_code = request.data.get('otp')
        email = request.data.get('email')

        if not otp_code or not email:
            return StandardResponse.error(
                "OTP and email are required.",
                {
                    "otp": ["This field is required."] if not otp_code else [],
                    "email": ["This field is required."] if not email else []
                }
            )

        # Rate limiting by email
        # rate_allowed, retry_after = RateLimiter.check_rate_limit(
        #     identifier=email,
        #     limit=5,  # 5 attempts per 5 minutes
        #     window=300,
        #     action_type="email_verification_confirm"
        # )
        #
        # if not rate_allowed:
        #     return StandardResponse.rate_limit_error(retry_after)

        try:
            # Fetch the OTP instance
            otp = OTP.objects.get(otp=otp_code, purpose='email_verification', is_used=False)

            if not otp.is_valid():
                return StandardResponse.error(
                    "Invalid or expired verification code.",
                    {"otp": ["The verification code has expired or has already been used."]}
                )

            # Validate that the email matches the user associated with the OTP
            if otp.user.email != email:
                return StandardResponse.error(
                    "Invalid verification code.",
                    {"otp": ["The verification code is invalid."]}
                )

            # Mark the email as verified
            user = otp.user
            user.email_verified = True
            user.save()

            # Mark the OTP as used
            otp.is_used = True
            otp.save()

            return StandardResponse.success(
                "Email verified successfully.",
                {
                    "user_id": user.id,
                    "email": user.email,
                    "verification_timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except OTP.DoesNotExist:
            # Generic error message to prevent enumeration
            return StandardResponse.error(
                "Invalid verification code.",
                {"otp": ["The verification code is invalid."]}
            )


class PasswordUpdateView(UpdateAPIView):
    """
    Handles password updates for the authenticated user.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordUpdateSerializer

    def get_object(self):
        return self.request.user
