from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from .views import CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView, LogoutView, UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/', LogoutView.as_view(), name='token_logout'),
    path('me/', UserDetailView.as_view(), name='user'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-data'),
]
