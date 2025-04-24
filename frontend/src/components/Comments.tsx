'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types/movie';
import { auth } from '@/lib/client-api';
import Image from 'next/image';
import { User, Clock, Send, X, Edit, Trash } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { JwtPayload } from 'jwt-decode';
import { Alert, AlertDescription } from './ui/alert';

interface UserJwtPayload extends JwtPayload {
  id?: number;
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

interface CommentsProps {
  movieId: string;
}

export default function Comments({ movieId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserJwtPayload | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  // Загрузка данных пользователя
  useEffect(() => {
    const user = auth.getCurrentUser() as UserJwtPayload | null;
    setCurrentUser(user);
  }, []);

  // Загрузка комментариев
  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/movies/${movieId}/comments/`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Не удалось загрузить комментарии');
      // Временно используем пустой массив
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    if (!currentUser) {
      setError('Чтобы оставить комментарий, необходимо войти в систему');
      return;
    }
    
    setSending(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/movies/${movieId}/comments/`, 
        { text: commentText, movie: movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Добавляем новый комментарий в список
      setComments(prev => [response.data, ...prev]);
      setCommentText('');
      setSuccess('Комментарий успешно добавлен');
      
      // Через 3 секунды убираем сообщение
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Не удалось отправить комментарий');
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editText.trim()) return;
    
    setSending(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/movies/${movieId}/comments/${commentId}/`, 
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Обновляем комментарий в списке
      setComments(prev => 
        prev.map(com => com.id === commentId ? response.data : com)
      );
      setEditingComment(null);
      setEditText('');
      setSuccess('Комментарий успешно обновлен');
      
      // Через 3 секунды убираем сообщение
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Не удалось обновить комментарий');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий?')) return;
    
    setSending(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `/api/movies/${movieId}/comments/${commentId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Удаляем комментарий из списка
      setComments(prev => prev.filter(com => com.id !== commentId));
      setSuccess('Комментарий успешно удален');
      
      // Через 3 секунды убираем сообщение
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Не удалось удалить комментарий');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { 
        addSuffix: true,
        locale: ru
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Комментарии</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-900/20 border-green-800">
          <AlertDescription className="text-green-300">{success}</AlertDescription>
        </Alert>
      )}
      
      {/* Форма добавления комментария */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            value={commentText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
            placeholder="Напишите ваш комментарий..."
            className="bg-gray-800 text-white border-gray-700 mb-2"
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={sending || !commentText.trim()} 
              className="bg-orange-500 hover:bg-orange-600 text-black"
            >
              {sending ? 'Отправка...' : 'Отправить'}
              {!sending && <Send className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-300 mb-2">Чтобы оставить комментарий, необходимо войти</p>
          <Button 
            onClick={() => window.location.href = '/login'}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            Войти
          </Button>
        </div>
      )}
      
      {/* Список комментариев */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-400">Загрузка комментариев...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div key={`comment-${comment.id || index}`} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              {editingComment === comment.id ? (
                <div className="mb-4">
                  <Textarea
                    value={editText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 mb-2"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    >
                      Отмена
                    </Button>
                    <Button 
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={sending || !editText.trim()}
                      className="bg-orange-500 hover:bg-orange-600 text-black"
                    >
                      Сохранить
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center mr-3">
                        {comment.user_avatar ? (
                          <Image 
                            src={comment.user_avatar.startsWith('http') 
                              ? comment.user_avatar 
                              : `http://localhost:8000${comment.user_avatar}`} 
                            alt={comment.username} 
                            width={40} 
                            height={40} 
                            className="object-cover" 
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{comment.username}</h4>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(comment.created_at)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Кнопки редактирования и удаления для автора комментария */}
                    {currentUser && currentUser.id === comment.user && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(comment)}
                          className="p-1 text-gray-400 hover:text-white"
                          title="Редактировать"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Удалить"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-200 whitespace-pre-line">{comment.text}</p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">Комментариев пока нет. Будьте первым!</p>
        </div>
      )}
    </div>
  );
} 