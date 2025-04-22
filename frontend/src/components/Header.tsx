'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/client-api';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    auth.removeToken();
    setUser(null);
    setIsMenuOpen(false);
    router.push('/login');
  };

  if (isLoading) return null;

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип и название */}
        <Link
          href="/"
          className="text-2xl font-bold hover:text-yellow-400 transition-colors flex items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="mr-2">🎬</span>
          Кинопоиск Клон
        </Link>

        {/* Десктопное меню */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/movies"
            className="hover:text-yellow-400 transition-colors"
          >
            Фильмы
          </Link>
          <Link
            href="/about"
            className="hover:text-yellow-400 transition-colors"
          >
            О нас
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors group"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="group-hover:underline">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link
                href="/login"
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition-colors"
              >
                Регистрация
              </Link>
            </div>
          )}
        </nav>

        {/* Кнопка мобильного меню */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-2 animate-fadeIn">
          <div className="flex flex-col space-y-3">
            <Link
              href="/movies"
              className="block py-2 hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Фильмы
            </Link>
            <Link
              href="/about"
              className="block py-2 hover:text-yellow-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-green-400 hover:text-green-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}