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
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      auth.removeToken();
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
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-bold hover:text-yellow-400 transition-colors">
            Кинопоиск
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/movies">Фильмы</NavLink>
          <NavLink href="/about">О нас</NavLink>

          {user ? (
            <div className="flex items-center gap-4">
              <UserAvatar user={user} />
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          ) : (
            <AuthButtons />
          )}
        </nav>

        <MobileMenuButton
          isOpen={isMenuOpen}
          toggle={() => setIsMenuOpen(!isMenuOpen)}
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

// Вспомогательные компоненты
const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} className="hover:text-yellow-400 transition-colors" onClick={onClick}>
    {children}
  </Link>
);

const UserAvatar = ({ user }: { user: any }) => (
  <Link href="/profile" className="flex items-center gap-2 group">
    {user.avatar ? (
      <Image
        src={user.avatar}
        alt={user.username}
        width={32}
        height={32}
        className="rounded-full"
      />
    ) : (
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
        {user.username.charAt(0).toUpperCase()}
      </div>
    )}
    <span className="group-hover:underline">{user.username}</span>
  </Link>
);

const AuthButtons = () => (
  <div className="flex gap-3">
    <Link href="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors">
      Войти
    </Link>
    <Link href="/register" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition-colors">
      Регистрация
    </Link>
  </div>
);

const MobileMenuButton = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
  <button
    className="md:hidden p-2"
    onClick={toggle}
    aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
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
}) => (
  <div className={`md:hidden bg-gray-800 px-4 py-2 ${isOpen ? 'block' : 'hidden'}`}>
    <div className="flex flex-col gap-3">
      <NavLink href="/movies" onClick={onNavigate}>Фильмы</NavLink>
      <NavLink href="/about" onClick={onNavigate}>О нас</NavLink>
      {user ? (
        <>
          <NavLink href="/profile" onClick={onNavigate}>Профиль</NavLink>
          <button
            onClick={onLogout}
            className="text-left py-2 text-red-400 hover:text-red-300 transition-colors"
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