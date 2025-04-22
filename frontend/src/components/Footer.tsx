import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">КИНОПОИСК</h3>
            <p className="text-gray-400">
              Лучшее место для поиска информации о фильмах, сериалах и телешоу
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Остальное</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Фильмы
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-yellow-400 transition-colors">
                  Поддержка
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Контакты</h4>
            <address className="text-gray-400 not-italic">
              <p>Email: info@kinopoisk.com</p>
              <p>Тел: +123-456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} КИНОПОИСК.ВСЕ ПРАВА ЗАЩИЩЕНЫ</p>
        </div>
      </div>
    </footer>
  );
}