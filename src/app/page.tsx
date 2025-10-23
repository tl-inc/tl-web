'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Target, Lightbulb, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';
import { PageLoading } from '@/components/common/PageLoading';

const coreValues = [
  {
    icon: Target,
    title: '以戰養戰',
    description: '透過大量練習題目，在實戰中累積經驗，培養解題直覺與應試能力'
  },
  {
    icon: Lightbulb,
    title: '即時詳解',
    description: '每道題目都有完整解析，答題後立即查看詳解，加深理解不留疑惑'
  },
  {
    icon: TrendingUp,
    title: '弱點擊破',
    description: '系統智慧分析你的答題表現，精準定位學習弱點，針對性加強訓練'
  },
  {
    icon: Eye,
    title: '成長可見',
    description: '完整記錄學習歷程與進步軌跡，讓每一分努力都清晰可見'
  }
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // 已登入，重定向到 dashboard
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
            Test Learn
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400 mb-8">
            克服弱點，題練潛能
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            開始體驗
          </Link>
        </div>

        {/* Core Values */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            四大核心理念
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
