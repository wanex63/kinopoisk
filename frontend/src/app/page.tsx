import MovieCarousel from '@/components/MovieCarousel';
import { getPopularMovies } from '@/lib/server-api';
import Link from 'next/link';
import './globals.css';

export default async function Home() {
  const popularMovies = await getPopularMovies();

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">КИНОПОИСК</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Откройте для себя лучшие фильмы, отслеживайте, что вы хотите посмотреть, и получайте персонализированные рекомендации
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/movies"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Фильмы
            </Link>
            <Link
              href="/register"
              className="bg-transparent hover:bg-gray-700 text-white font-bold py-3 px-6 border border-white rounded-lg transition-colors duration-300"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Movies</h2>
          <MovieCarousel movies={popularMovies} />
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
              title="Путешевствие по фильмам"
              description="Изучите тысячи фильмов с подробной информацией, рейтингами и рецензиями"
            />
            <FeatureCard
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              }
              title="Сохраняйте любимые фильмы"
              description="Сохраняйте фильмы в своем списке просмотра и отслеживайте, что вы хотите посмотреть"
            />
            <FeatureCard
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              }
              title="Персональные рекомендации"
              description="Получайте рекомендации по фильмам на основе ваших предпочтений и истории просмотров"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}