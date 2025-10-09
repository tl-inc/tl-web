'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // 已登入，重定向到 dashboard
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // 載入中時顯示空白或載入畫面
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  // 已登入會被重定向，這裡只給未登入的使用者看
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Test Learn
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              克服弱點，題練潛能
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
