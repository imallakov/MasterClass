from django.urls import path
from . import views

urlpatterns = [
    path('', views.MasterClassListCreateView.as_view(), name='masterclass-list-create'),
    path('<int:pk>/', views.MasterClassDetailView.as_view(), name='masterclass-detail'),
    path('slots/', views.MasterClassSlotCreateView.as_view(), name='slot-create'),
]
