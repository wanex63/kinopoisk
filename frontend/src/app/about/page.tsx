'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero секция */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">О нашем проекте</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Мы создаем лучший онлайн-сервис для любителей кино и сериалов
          </p>
        </div>
      </section>

      {/* Основная информация */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 mb-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Наша миссия</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Кинопоиск создан с одной целью — помочь зрителям находить лучшие фильмы и сериалы, 
              соответствующие их вкусам и предпочтениям. Мы стремимся создать самую полную и 
              удобную базу данных кинематографических произведений, которая поможет вам 
              сориентироваться в огромном мире кино.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Наша команда состоит из энтузиастов киноиндустрии, которые постоянно работают над 
              улучшением сервиса и обновлением информации. Мы верим, что хорошее кино способно 
              изменить жизнь к лучшему, и хотим помочь вам найти именно те фильмы, которые 
              затронут ваше сердце.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Что мы предлагаем</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Обширную базу фильмов и сериалов с подробным описанием</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Персональные рекомендации на основе ваших предпочтений</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Возможность создания списков избранных фильмов</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Оценки и отзывы от реальных зрителей</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Наши планы</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Мы постоянно развиваемся и стремимся сделать Кинопоиск еще более 
                удобным и полезным. В ближайшем будущем мы планируем:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span>Улучшение системы рекомендаций с применением ИИ</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span>Интеграция с популярными стриминговыми сервисами</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                  <span>Расширение функциональности социальной составляющей</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Присоединяйтесь к нам!</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Создайте аккаунт и начните пользоваться всеми возможностями нашего сервиса
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Регистрация
            </Link>
            <Link
              href="/movies"
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 