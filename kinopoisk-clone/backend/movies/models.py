from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from users.models import CustomUser
from django.core.validators import MinValueValidator, MaxValueValidator


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.get_unique_slug()
        super().save(*args, **kwargs)

    def get_unique_slug(self):
        slug = slugify(self.name)
        unique_slug = slug
        num = 1

        while Genre.objects.filter(slug=unique_slug).exists():
            unique_slug = f"{slug}-{num}"
            num += 1

        return unique_slug


class Movie(models.Model):
    kinopoisk_id = models.IntegerField(
        _('Kinopoisk ID'),
        unique=True,
        help_text=_('Unique identifier from Kinopoisk')
    )
    title = models.CharField(
        _('title'),
        max_length=255,
        help_text=_('Movie title in Russian')
    )
    original_title = models.CharField(
        _('original title'),
        max_length=255,
        blank=True,
        default='',
        help_text=_('Movie title in original language')
    )
    description = models.TextField(
        _('description'),
        blank=True,
        default='',
        help_text=_('Detailed movie description')
    )
    year = models.PositiveIntegerField(
        _('year'),
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1888),  # Первый фильм в истории
            MaxValueValidator(2100)  # Будущие фильмы
        ],
        help_text=_('Release year')
    )
    rating = models.FloatField(
        _('rating'),
        null=True,
        blank=True,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10)
        ],
        help_text=_('Rating from 0 to 10')
    )
    poster_url = models.URLField(
        _('poster URL'),
        blank=True,
        default='',
        max_length=500,
        help_text=_('URL to movie poster image')
    )
    genres = models.ManyToManyField(
        Genre,
        related_name='movies',
        verbose_name=_('genres'),
        help_text=_('Movie genres')
    )
    duration = models.PositiveIntegerField(
        _('duration'),
        null=True,
        blank=True,
        help_text=_('Duration in minutes')
    )
    countries = models.JSONField(
        _('countries'),
        default=list,
        help_text=_('List of production countries')
    )
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
        help_text=_('Date when movie was added to database')
    )
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True,
        help_text=_('Date when movie was last updated')
    )

    class Meta:
        verbose_name = _('movie')
        verbose_name_plural = _('movies')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['rating'], name='movie_rating_idx'),
            models.Index(fields=['year'], name='movie_year_idx'),
            models.Index(fields=['title'], name='movie_title_idx'),
        ]

    def __str__(self):
        if self.year:
            return f"{self.title} ({self.year})"
        return self.title

    def get_duration_display(self):
        if not self.duration:
            return ""
        hours = self.duration // 60
        minutes = self.duration % 60
        return f"{hours}h {minutes}m"


class Favorite(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name=_('user'),
        help_text=_('User who added the movie to favorites')
    )
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name='favorited_by',
        verbose_name=_('movie'),
        help_text=_('Favorite movie')
    )
    added_at = models.DateTimeField(
        _('added at'),
        auto_now_add=True,
        help_text=_('Date when movie was added to favorites')
    )

    class Meta:
        verbose_name = _('favorite')
        verbose_name_plural = _('favorites')
        unique_together = ('user', 'movie')
        ordering = ['-added_at']
        indexes = [
            models.Index(fields=['user', 'added_at'], name='favorite_user_added_idx'),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class Comment(models.Model):
    user = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name=_('user'),
        help_text=_('User who posted the comment')
    )
    movie = models.ForeignKey(
        Movie, 
        on_delete=models.CASCADE, 
        related_name='comments',
        verbose_name=_('movie'),
        help_text=_('Movie being commented on')
    )
    text = models.TextField(
        _('text'),
        help_text=_('Comment text')
    )
    created_at = models.DateTimeField(
        _('created at'),
        auto_now_add=True,
        help_text=_('Date when comment was created')
    )
    updated_at = models.DateTimeField(
        _('updated at'),
        auto_now=True,
        help_text=_('Date when comment was last updated')
    )

    class Meta:
        verbose_name = _('comment')
        verbose_name_plural = _('comments')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user'], name='comment_user_idx'),
            models.Index(fields=['movie'], name='comment_movie_idx'),
            models.Index(fields=['created_at'], name='comment_created_idx'),
        ]

    def __str__(self):
        return f"{self.user.username} on {self.movie.title}: {self.text[:50]}"