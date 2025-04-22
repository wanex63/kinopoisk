'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, api } from '@/lib/client-api';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await api.get(`/user/`);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    auth.removeToken();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Username:</span> {user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Favorites</h2>
            {user.favorites?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Здесь можно отобразить избранные фильмы */}
              </div>
            ) : (
              <p className="text-gray-500">You don't have any favorites yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}