'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Здесь в будущем можно добавить реальную отправку данных формы
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({
        type: 'success',
        message: 'Ваше сообщение успешно отправлено! Наша команда свяжется с вами в ближайшее время.'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Заголовок */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Поддержка пользователей</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Мы всегда готовы помочь вам с любыми вопросами о сервисе Кинопоиск
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* FAQ секция */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Часто задаваемые вопросы</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Как создать аккаунт?</h3>
                  <p className="text-gray-600">
                    Для создания аккаунта перейдите на страницу регистрации и заполните необходимую информацию. 
                    После подтверждения email вы получите доступ ко всем функциям сайта.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Как добавить фильм в избранное?</h3>
                  <p className="text-gray-600">
                    Чтобы добавить фильм в избранное, необходимо авторизоваться и нажать на иконку "звездочки" 
                    на странице фильма. Все избранные фильмы будут доступны в вашем личном кабинете.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Как получать персональные рекомендации?</h3>
                  <p className="text-gray-600">
                    Система рекомендаций автоматически анализирует ваши предпочтения на основе фильмов, 
                    которые вы добавили в избранное или оценили. Чем больше фильмов вы оцените, 
                    тем точнее будут рекомендации.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Как изменить информацию в профиле?</h3>
                  <p className="text-gray-600">
                    Для изменения личной информации перейдите в раздел "Профиль" и нажмите кнопку "Редактировать". 
                    Там вы сможете изменить имя пользователя, email и добавить аватар.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Полезные ресурсы</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/about" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-blue-600">О нашем проекте</h3>
                  <p className="text-gray-600 text-sm mt-1">Узнайте больше о нашей миссии и ценностях</p>
                </Link>
                
                <Link href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-blue-600">Правила использования</h3>
                  <p className="text-gray-600 text-sm mt-1">Ознакомьтесь с правилами и условиями сервиса</p>
                </Link>
                
                <Link href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-blue-600">Политика конфиденциальности</h3>
                  <p className="text-gray-600 text-sm mt-1">Как мы обрабатываем ваши данные</p>
                </Link>
                
                <Link href="#" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h3 className="font-semibold text-blue-600">Партнерская программа</h3>
                  <p className="text-gray-600 text-sm mt-1">Информация для партнеров и рекламодателей</p>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Форма обратной связи */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Связаться с нами</h2>
              
              {submitStatus && (
                <div className={`p-4 mb-4 rounded-md ${
                  submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ваше имя
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Тема
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Выберите тему</option>
                    <option value="account">Вопросы по аккаунту</option>
                    <option value="technical">Технические проблемы</option>
                    <option value="content">Вопросы по контенту</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 