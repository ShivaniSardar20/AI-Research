from django.db import models


class Paper(models.Model):
    filename   = models.CharField(max_length=255)
    title      = models.CharField(max_length=255, blank=True, default='')
    file       = models.FileField(upload_to='papers/', blank=True, null=True)
    text       = models.TextField(blank=True, default='')       # extracted text (sent from frontend)
    summary    = models.JSONField(null=True, blank=True)         # { abstract, methodology, findings, limitations }
    insights   = models.JSONField(null=True, blank=True)         # { objectives, concepts, conclusions }
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or self.filename
