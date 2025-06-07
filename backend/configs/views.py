from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser

from .models import AboutUs
from .serializers import AboutUsSerializer


class AboutUsRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = AboutUs.objects.all()
    serializer_class = AboutUsSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        # Get or create the AboutUs instance (there should be only one)
        obj, created = AboutUs.objects.get_or_create(
            defaults={
                'title': 'О Нас',
                'description': 'Мы - команда опытных  мастеров, которые   делятся своим опытом и любовью к творчеству. Наши мастер-классы проходят в уютной  атмосфере и подходят для людей любого  уровня подготовки.',
            }
        )
        return obj
