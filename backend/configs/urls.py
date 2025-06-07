from django.urls import path
from . import views

urlpatterns = [
    path('about/', views.AboutUsRetrieveUpdateView.as_view(), name='about-us'),
]
