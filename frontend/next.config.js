/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['kinopoiskapiunofficial.tech', 'localhost'], // Добавлен localhost
  },
  async rewrites() {
    return [
      // Специальное правило для маршрута регистрации с явным слэшем
      {
        source: '/api/auth/register',
        destination: 'http://localhost:8000/api/auth/register/',
      },
      // Общее правило для остальных API маршрутов
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*/', // Добавлен слэш в конце
      },
    ];
  },
};

module.exports = nextConfig;