from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Movie, Favorite
from .serializers import MovieSerializer, FavoriteSerializer
from django.shortcuts import get_object_or_404
from django.db.models import Q


class MovieListView(generics.ListAPIView):
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = Movie.objects.all()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(original_title__icontains=search_query)
            )
        return queryset


class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_field = 'id'


class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)


class FavoriteAddRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, movie_id):
        movie = get_object_or_404(Movie, id=movie_id)
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            movie=movie
        )
        if created:
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, movie_id):
        favorite = get_object_or_404(
            Favorite,
            user=request.user,
            movie__id=movie_id
        )
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)