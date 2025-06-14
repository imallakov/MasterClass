from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.StickerCategoriesListCreateView.as_view(), name='sticker-categories-list'),
    path('categories/<int:pk>/', views.StickerCategoriesDetailView.as_view(), name='sticker-categories-detail'),
    path('', views.StickerListCreateView.as_view(), name='sticker-list'),
    path('<int:pk>/', views.StickerDetailView.as_view(), name='sticker-detail'),
    # path('orders/', views.StickerOrderView.as_view(), name='sticker-order'),
]
