from django.db import models

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
