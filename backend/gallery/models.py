from django.db import models
from image_optimizer.fields import OptimizedImageField


class GalleryImage(models.Model):
    image = OptimizedImageField(
        upload_to='gallery/',
        optimized_image_output_size=(0, 0),  # No resizing
        optimized_image_resize_method='thumbnail',  # Doesn't matter since no resizing
        optimized_image_quality=85  # Quality setting
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.name
