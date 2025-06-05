from django.urls import path
from . import views
from .views import MasterClassEnrollmentCreateView

urlpatterns = [
    path('', views.MasterClassListCreateView.as_view(), name='masterclass-list-create'),
    path('<int:pk>/', views.MasterClassDetailView.as_view(), name='masterclass-detail'),
    path('slots/', views.MasterClassSlotCreateView.as_view(), name='slot-create'),
    path('enroll/', MasterClassEnrollmentCreateView.as_view(), name='masterclass-enroll')
]
