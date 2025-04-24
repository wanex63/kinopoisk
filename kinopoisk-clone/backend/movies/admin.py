from django.contrib import admin
from .models import Movie, Genre, Favorite, Comment
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

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('movie', 'user', 'text_preview', 'created_at')
    list_filter = ('movie', 'created_at')
    search_fields = ('text', 'user__username', 'movie__title')
    raw_id_fields = ('user', 'movie')
    date_hierarchy = 'created_at'
    
    def text_preview(self, obj):
        if len(obj.text) > 50:
            return obj.text[:50] + '...'
        return obj.text
    text_preview.short_description = 'Comment'