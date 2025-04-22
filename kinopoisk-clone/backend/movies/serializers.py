from rest_framework import serializers
from .models import Movie, Genre, Favorite


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name')


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True)

    class Meta:
        model = Movie
        fields = ('id', 'kinopoisk_id', 'title', 'original_title', 'description',
                  'year', 'rating', 'poster_url', 'genres', 'duration', 'countries')


class FavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = Favorite
        fields = ('id', 'movie', 'added_at')