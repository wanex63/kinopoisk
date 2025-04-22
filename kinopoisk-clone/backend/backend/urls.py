from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Админка
    path('admin/', admin.site.urls),

    # Маршруты приложений
    path('api/auth/', include('users.urls', namespace='users')),  # Аутентификация
    path('api/movies/', include('movies.urls', namespace='movies')),  # Фильмы

    # Документация API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]