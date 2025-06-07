from django.urls import path
from . import views

urlpatterns = [
    path('', views.GalleryImageListCreateView.as_view(), name='gallery-list'),
    path('<int:pk>/', views.GalleryImageDeleteView.as_view(), name='gallery-delete'),
]
