from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Movie, Favorite
from .serializers import (
    MovieSerializer,
    FavoriteSerializer,
    MovieCreateUpdateSerializer
)
from django.shortcuts import get_object_or_404

class MovieListView(generics.ListCreateAPIView):
    queryset = Movie.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genres', 'year']
    search_fields = ['title', 'original_title', 'description']
    ordering_fields = ['rating', 'year', 'title']
    ordering = ['-rating']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MovieCreateUpdateSerializer
        return MovieSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return MovieCreateUpdateSerializer
        return MovieSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.favorites.all()

class FavoriteAddRemoveView(generics.CreateAPIView, generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'movie_id'

    def get_queryset(self):
        return self.request.user.favorites.all()

    def perform_create(self, serializer):
        movie = get_object_or_404(Movie, id=self.kwargs['movie_id'])
        serializer.save(user=self.request.user, movie=movie)

    def delete(self, request, *args, **kwargs):
        favorite = get_object_or_404(
            Favorite,
            user=request.user,
            movie_id=kwargs['movie_id']
        )
        favorite.delete()
        return Response(status=204)