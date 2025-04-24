from django.urls import path
from .views import (
    MovieListView,
    MovieDetailView,
    FavoriteListView,
    FavoriteAddRemoveView,
    CommentListCreateView,
    CommentDetailView
)

app_name = 'movies'

urlpatterns = [
    path('', MovieListView.as_view(), name='movie_list'),
    path('movies/', MovieListView.as_view(), name='movie-list'),
    path('<int:id>/', MovieDetailView.as_view(), name='movie_detail'),
    path('favorites/', FavoriteListView.as_view(), name='favorite_list'),
    path('favorites/<int:movie_id>/',
         FavoriteAddRemoveView.as_view(),
         name='favorite_add_remove'),
    # URLs для комментариев
    path('<int:movie_id>/comments/', 
         CommentListCreateView.as_view(), 
         name='comment_list_create'),
    path('<int:movie_id>/comments/<int:pk>/', 
         CommentDetailView.as_view(), 
         name='comment_detail'),
]