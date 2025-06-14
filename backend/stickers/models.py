from django.contrib.auth import get_user_model
from django.db import models

# from image_optimizer.fields import OptimizedImageField

User = get_user_model()


class StickerCategories(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.title


class Sticker(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(
        upload_to='stickers/',
        # optimized_image_output_size=(0, 0),  # No resizing
        # optimized_image_resize_method='thumbnail',  # Doesn't matter since no resizing
        # optimized_image_quality=85  # Quality setting
    )
    category = models.ForeignKey(StickerCategories, on_delete=models.CASCADE, null=True, related_name='stickers')
    wb_link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# class StickerOrder(models.Model):
#     sticker = models.ForeignKey(Sticker, on_delete=models.CASCADE)
#     full_name = models.CharField(max_length=255)
#     quantity = models.PositiveIntegerField()
#     phone_number = models.CharField(max_length=255)
#     created_at = models.DateTimeField(auto_now_add=True)
