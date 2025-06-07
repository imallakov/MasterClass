from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class MasterClass(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to='masterclass_images/')
    participant_limit = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class MasterClassSlot(models.Model):
    masterclass = models.ForeignKey(MasterClass, related_name='slots', on_delete=models.CASCADE)
    start = models.DateTimeField()
    end = models.DateTimeField(null=True, blank=True)  # можно не использовать, если не нужно

    def __str__(self):
        return f"{self.masterclass.title} — {self.start.strftime('%d.%m.%Y %H:%M')}"


class MasterClassEnrollment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидание оплаты'),
        ('paid', 'Оплачено'),
        ('cancelled', 'Отменено'),
    ]
    user = models.ForeignKey(User, related_name='enrollments', on_delete=models.CASCADE)
    slot = models.ForeignKey('MasterClassSlot', related_name='enrollments', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'slot')  # один юзер — одна бронь на слот

    def __str__(self):
        return f"{self.user} на {self.slot} ({self.get_status_display()})"


class GalleryImage(models.Model):
    image = models.ImageField(upload_to='gallery/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.name
