from django.contrib import admin
from .models import Movie, Genre, Favorite
from django.utils.html import format_html

class GenreInline(admin.TabularInline):
    model = Movie.genres.through
    extra = 1
    verbose_name = "Жанр"
    verbose_name_plural = "Жанры"

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'rating', 'poster_preview')
    search_fields = ('title', 'original_title')
    list_filter = ('genres', 'year', 'rating')
    inlines = [GenreInline]
    exclude = ('genres',)
    readonly_fields = ('created_at', 'updated_at')
    list_per_page = 20

    def poster_preview(self, obj):
        if obj.poster_url:
            return format_html('<img src="{}" height="50" />', obj.poster_url)
        return "-"
    poster_preview.short_description = "Постер"

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('user__username', 'movie__title')
    date_hierarchy = 'added_at'