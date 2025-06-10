from django.db import models


class AboutUs(models.Model):
    title = models.CharField(max_length=255, default='О Нас')
    description = models.TextField()
    image = models.ImageField(upload_to='about_us/')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "About Us"

    def __str__(self):
        return self.title


class Contacts(models.Model):
    phone_number = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.TextField()
    telegram_id = models.CharField(max_length=255)
    vk_id = models.CharField(max_length=255)
