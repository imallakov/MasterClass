from django.urls import path
from . import views

urlpatterns = [
    path('', views.MasterClassListCreateView.as_view(), name='masterclass-list-create'),
    path('<int:pk>/', views.MasterClassDetailUpdateView.as_view(), name='masterclass-detail'),
    path('slots/', views.MasterClassSlotCreateView.as_view(), name='slot-create'),
    path('slots/<int:pk>/', views.MasterClassSlotDeleteView.as_view(), name='slot-delete'),
    path('enroll/', views.MasterClassEnrollmentCreateView.as_view(), name='masterclass-enroll'),
    path('gallery/', views.GalleryImageListView.as_view(), name='gallery-list'),
    path('gallery/', views.GalleryImageUploadView.as_view(), name='gallery-upload'),
    path('gallery/<int:pk>/', views.GalleryImageDeleteView.as_view(), name='gallery-delete'),
]
