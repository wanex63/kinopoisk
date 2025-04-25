from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    work = models.CharField(max_length=255, blank=True)
    education = models.CharField(max_length=255, blank=True)
    profession = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.username