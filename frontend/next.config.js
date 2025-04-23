/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['kinopoiskapiunofficial.tech', 'localhost', 'avatars.mds.yandex.net'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/register',
        destination: 'http://localhost:8000/api/auth/register/',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*/',
      },
    ];
  },
};

module.exports = nextConfig;