from django.db import models
from users.models import CustomUser


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Movie(models.Model):
    kinopoisk_id = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    original_title = models.CharField(max_length=255, blank=True, default='')  # Изменено
    description = models.TextField(blank=True, default='')  # Добавлено default
    year = models.IntegerField(null=True, blank=True)  # Добавлено null=True
    rating = models.FloatField(null=True, blank=True)
    poster_url = models.URLField(blank=True, default='')  # Добавлено default
    genres = models.ManyToManyField(Genre)
    duration = models.IntegerField(null=True, blank=True, help_text="Duration in minutes")  # Добавлено null=True
    countries = models.JSONField(default=list)

    def __str__(self):
        return self.title


class Favorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"