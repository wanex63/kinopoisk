import requests
import logging
from django.core.management.base import BaseCommand
from movies.models import Movie, Genre
from django.conf import settings

logger = logging.getLogger(__name__)

KINOPOISK_API_URL = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"
HEADERS = {
    "X-API-KEY": settings.KINOPOISK_API_KEY,
    "Content-Type": "application/json",
}


class Command(BaseCommand):
    help = 'Fetch popular movies from Kinopoisk API'

    def handle(self, *args, **options):
        self.fetch_popular_movies()

    def fetch_popular_movies(self):
        try:
            for page in range(1, 3):  # Страницы 1 и 2 = 100 фильмов
                response = requests.get(
                    f"{KINOPOISK_API_URL}top?type=TOP_100_POPULAR_FILMS&page={page}",
                    headers=HEADERS
                )
                response.raise_for_status()

                films = response.json().get('films', [])
                logger.info(f"[Page {page}] Found {len(films)} films to process")

                for film_data in films:
                    kinopoisk_id = film_data.get('filmId')
                    logger.info(f"Processing film ID: {kinopoisk_id} - {film_data.get('nameRu')}")

                    if Movie.objects.filter(kinopoisk_id=kinopoisk_id).exists():
                        logger.info(f"Film {kinopoisk_id} already exists, skipping")
                        continue

                    try:
                        detail_response = requests.get(
                            f"{KINOPOISK_API_URL}{kinopoisk_id}",
                            headers=HEADERS
                        )
                        detail_response.raise_for_status()
                        detail_data = detail_response.json()
                        self.create_movie_from_data(detail_data)
                    except requests.exceptions.RequestException as e:
                        logger.error(f"Failed to fetch details for film {kinopoisk_id}: {e}")
                    except Exception as e:
                        logger.error(f"Error processing film {kinopoisk_id}: {e}")

        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to fetch popular films: {e}")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")

    def create_movie_from_data(self, data):
        # Обработка жанров
        genres = []
        for genre_data in data.get('genres', []):
            genre_name = genre_data.get('genre')
            if genre_name:
                genre, _ = Genre.objects.get_or_create(name=genre_name)
                genres.append(genre)

        # Обработка значений, которые могут быть null
        original_title = data.get('nameOriginal', '') or ''
        description = data.get('description', '') or ''
        year = data.get('year')
        rating = data.get('ratingKinopoisk')
        poster_url = data.get('posterUrl', '') or ''
        duration = data.get('filmLength')
        countries = data.get('countries', [])

        # Создание фильма
        movie = Movie.objects.create(
            kinopoisk_id=data['kinopoiskId'],
            title=data.get('nameRu', '') or 'No title',
            original_title=original_title,
            description=description,
            year=year,
            rating=rating,
            poster_url=poster_url,
            duration=duration,
            countries=countries,
        )

        # Добавление жанров
        if genres:
            movie.genres.set(genres)

        logger.info(f"Successfully created movie: {movie.title} (ID: {movie.id})")
        return movie