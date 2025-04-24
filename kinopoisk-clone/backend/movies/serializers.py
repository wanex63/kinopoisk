from rest_framework import serializers
from .models import Movie, Genre, Favorite, Comment
from django.utils.text import slugify

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name', 'slug')


class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True)
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ('id', 'kinopoisk_id', 'title', 'original_title', 'description',
                'year', 'rating', 'poster_url', 'genres', 'duration',
                'countries', 'created_at', 'updated_at', 'is_favorite')
        read_only_fields = ('created_at', 'updated_at')

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.favorited_by.filter(user=request.user).exists()
        return False

class FavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Favorite
        fields = ('id', 'movie', 'user', 'added_at')
        read_only_fields = ('added_at',)

class MovieCreateUpdateSerializer(serializers.ModelSerializer):
    genres = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Genre.objects.all()
    )

    class Meta:
        model = Movie
        fields = ('kinopoisk_id', 'title', 'original_title', 'description',
                'year', 'rating', 'poster_url', 'genres', 'duration', 'countries')

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ('id', 'user', 'username', 'user_avatar', 'movie', 'text', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_user_avatar(self, obj):
        if obj.user.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.user.avatar.url)
        return None
        
        
class CommentCreateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Comment
        fields = ('user', 'movie', 'text')