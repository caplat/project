from django.contrib.auth.models import AbstractUser
from django.db import models

class Utilisateur(AbstractUser):
    is_connected = models.BooleanField(default=False)
    alias = models.CharField(max_length=50, blank=True, null=True)


