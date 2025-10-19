'use client';

import Link from 'next/link';
import { BookOpen, History, BarChart3, TrendingUp, Flame } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const dashboardItems = [
  {
    title: '開始練習',
    icon: BookOpen,
    href: '/paper-configuration',
    description: '配置並開始新的練習'
  },
  {
    title: '刷題挑戰',
    icon: Flame,
    href: '/exercise-session-configuration',
    description: '快速訓練，即時詳解',
    highlight: true, // 新功能高亮
  },
  {
    title: '考卷回顧',
    icon: History,
    href: '/paper-history',
    description: '查看過去的練習記錄'
  },
  {
    title: '程度分析',
    icon: BarChart3,
    href: '/analytics',
    description: '分析你的學習表現'
  },
  {
    title: '成長曲線',
    icon: TrendingUp,
    href: '/chart',
    description: '追蹤學習進度'
  }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.username || user?.full_name;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
              {displayName}，你好
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardItems.map((item) => {
                const Icon = item.icon;
                const isHighlight = item.highlight;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group"
                  >
                    <div className={`relative h-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border ${
                      isHighlight
                        ? 'border-orange-500 ring-2 ring-orange-500/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      {isHighlight && (
                        <div className="absolute -top-2 -right-2 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                          NEW
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-4 rounded-full transition-colors ${
                          isHighlight
                            ? 'bg-orange-50 dark:bg-orange-900/20 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30'
                            : 'bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                        }`}>
                          <Icon className={`w-12 h-12 ${
                            isHighlight
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          {item.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
