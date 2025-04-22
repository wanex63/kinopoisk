from django.contrib import admin
from .models import Movie, Genre, Favorite

class GenreInline(admin.TabularInline):
    model = Movie.genres.through
    extra = 1

class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'rating')
    search_fields = ('title', 'original_title')
    list_filter = ('genres', 'year')
    inlines = [GenreInline]
    exclude = ('genres',)

admin.site.register(Movie, MovieAdmin)
admin.site.register(Genre)
admin.site.register(Favorite)