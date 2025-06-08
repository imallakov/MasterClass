"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,  # OpenAPI schema (JSON)
    SpectacularSwaggerView,  # Swagger UI
    SpectacularRedocView,  # ReDoc
)

from .views import csrf

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path("api/csrf/", csrf, name="csrf"),
                  path('api/configs/', include(('configs.urls', 'configs'), namespace='configs')),
                  path('api/users/', include(('users.urls', 'users'), namespace='users')),
                  path('api/masterclasses/',
                       include(('masterclasses.urls', 'masterclasses'), namespace='masterclasses')),
                  path('api/gallery/', include(('gallery.urls', 'gallery'), namespace='gallery')),
                  path('api/stickers/', include(('stickers.urls', 'stickers'), namespace='stickers')),
                  path('api/reviews/', include(('reviews.urls', 'reviews'), namespace='reviews')),
                  # OpenAPI Schema
                  path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
                  # Swagger UI (Interactive Docs)
                  path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
                  # ReDoc (Alternative Docs)
                  path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
