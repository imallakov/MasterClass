from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import AboutUs, Contacts
from .serializers import AboutUsSerializer, ContactsSerializer


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


class ContactsAPIView(generics.GenericAPIView):
    serializer_class = ContactsSerializer
    queryset = Contacts.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_object(self):
        # Always return the single instance or create empty one
        obj, created = Contacts.objects.get_or_create(pk=1)
        return obj

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # Handle both create and update through POST
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
