from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from .views import CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView, LogoutView, UserDetailView, \
    UserListView, PasswordResetRequestView, PasswordResetValidateOTPView, PasswordResetConfirmView, \
    EmailVerificationRequestView, EmailVerificationConfirmView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='token_logout'),
    path('me/', UserDetailView.as_view(), name='user'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-data'),
    path('', UserListView.as_view(), name='user-list'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/validate/', PasswordResetValidateOTPView.as_view(), name='password-reset-validate'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('email-verify/request/', EmailVerificationRequestView.as_view(), name='email-verification-request'),
    path('email-verify/confirm/', EmailVerificationConfirmView.as_view(), name='email-verification-confirm'),
]
