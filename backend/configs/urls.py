from django.urls import path
from . import views
from .views import ContactsAPIView, AboutUsRetrieveUpdateView

urlpatterns = [
    path('about/', AboutUsRetrieveUpdateView.as_view(), name='about-us'),
    path('contacts/', ContactsAPIView.as_view(), name='contacts'),
]
