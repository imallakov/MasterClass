from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a superuser if it does not exist'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        try:
            # Attempt to retrieve the user
            User.objects.get(email='admin@example.com')
            self.stdout.write(self.style.WARNING('Superuser already exists.'))
        except User.DoesNotExist:
            # Create the superuser if it does not exist
            superuser = User.objects.create_superuser(
                email='admin@example.com',
                phone_number='12345',
                password='adminpass',
            )
            self.stdout.write(self.style.SUCCESS(f'Superuser created: {superuser.email}:{superuser.password}'))
