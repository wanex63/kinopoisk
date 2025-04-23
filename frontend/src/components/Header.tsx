'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
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
        if (!currentUser && localStorage.getItem('token')) {
          // Попытка обновить токен
          const refreshedUser = await auth.refreshToken();
          setUser(refreshedUser);
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        auth.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await auth.removeToken();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  if (isLoading) return null;

  return (
    <header className="bg-black text-white shadow-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="На главную"
        >
          <span className="text-2xl" role="img" aria-hidden="true">🎬</span>
          <span className="text-xl font-bold text-orange-500 hover:text-orange-400 transition-colors">
            Кинопоиск
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink
            href="/movies"
            className="hover:text-orange-500 transition-colors"
            activeClassName="text-orange-500 font-medium"
          >
            Фильмы
          </NavLink>
          <NavLink
            href="/about"
            className="hover:text-orange-500 transition-colors"
            activeClassName="text-orange-500 font-medium"
          >
            О нас
          </NavLink>

          {user ? (
            <div className="flex items-center gap-4">
              <UserAvatar
                user={user}
                className="w-8 h-8"
                fallbackText={user.name?.[0] || user.username?.[0] || '?'}
              />
              <button
                onClick={handleLogout}
                className="bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                aria-label="Выйти из аккаунта"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          ) : (
            <AuthButtons />
          )}
        </nav>

        <MobileMenuButton
          isOpen={isMenuOpen}
          toggle={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
        />
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        user={user}
        onLogout={handleLogout}
        onNavigate={() => setIsMenuOpen(false)}
      />
    </header>
  );
}

// Вспомогательные компоненты остаются без изменений
const NavLink = ({
  href,
  children,
  onClick,
  className,
  activeClassName
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
}) => (
  <Link
    href={href}
    className={`${className || "hover:text-orange-500 transition-colors"} ${
      typeof window !== 'undefined' && window.location.pathname === href ? activeClassName || '' : ''
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

const UserAvatar = ({
  user,
  className,
  fallbackText
}: {
  user: any;
  className?: string;
  fallbackText?: string;
}) => {
  const username = user?.username || (user?.email ? user.email.split('@')[0] : '');

  return (
    <Link href="/profile">
      <div className="flex items-center gap-2">
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={username || 'User'}
            width={32}
            height={32}
            className={`rounded-full ${className || ""}`}
          />
        ) : (
          <div className={`w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center text-white font-semibold ${className || ""}`}>
            {fallbackText || (username ? username[0].toUpperCase() : 'U')}
          </div>
        )}
      </div>
    </Link>
  );
};

const AuthButtons = () => (
  <div className="flex gap-3">
    <Link href="/login" className="bg-orange-600 px-3 py-1 rounded hover:bg-orange-700 transition-colors">
      Войти
    </Link>
    <Link href="/register" className="bg-gray-800 border border-orange-600 px-3 py-1 rounded hover:bg-gray-700 transition-colors">
      Регистрация
    </Link>
  </div>
);

const MobileMenuButton = ({
  isOpen,
  toggle,
  className,
  "aria-label": ariaLabel
}: {
  isOpen: boolean;
  toggle: () => void;
  className?: string;
  "aria-label"?: string;
}) => (
  <button
    className={`p-2 ${className || ""}`}
    onClick={toggle}
    aria-label={ariaLabel || (isOpen ? 'Закрыть меню' : 'Открыть меню')}
  >
    {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
  </button>
);

const MobileMenu = ({
  isOpen,
  user,
  onLogout,
  onNavigate
}: {
  isOpen: boolean;
  user: any;
  onLogout: () => void;
  onNavigate: () => void
}) => {
  const username = user?.username || (user?.email ? user.email.split('@')[0] : '');

  return (
    <div className={`md:hidden bg-black border-t border-gray-800 px-4 py-2 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex flex-col gap-3">
        <NavLink href="/movies" onClick={onNavigate}>Фильмы</NavLink>
        <NavLink href="/about" onClick={onNavigate}>О нас</NavLink>
        {user ? (
          <>
            <NavLink href="/profile" onClick={onNavigate}>
              {username || 'Профиль'}
            </NavLink>
            <button
              onClick={onLogout}
              className="text-left py-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink href="/login" onClick={onNavigate}>Войти</NavLink>
            <NavLink href="/register" onClick={onNavigate}>Регистрация</NavLink>
          </>
        )}
      </div>
    </div>
  );
};