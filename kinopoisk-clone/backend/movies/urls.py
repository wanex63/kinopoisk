from django.urls import path
from .views import (
    MovieListView,
    MovieDetailView,
    FavoriteListView,
    FavoriteAddRemoveView
)

app_name = 'movies'

urlpatterns = [
    path('', MovieListView.as_view(), name='movie_list'),
    path('<int:id>/', MovieDetailView.as_view(), name='movie_detail'),
    path('favorites/', FavoriteListView.as_view(), name='favorite_list'),
    path('favorites/<int:movie_id>/',
         FavoriteAddRemoveView.as_view(),
         name='favorite_add_remove'),
]