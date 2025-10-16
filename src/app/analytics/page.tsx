'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card } from '@/components/ui/card';
import { BarChart3, Target } from 'lucide-react';

const SUBJECT_ID = 1; // 英文科目 (目前系統只有英文)

export default function AnalyticsPage() {
  const router = useRouter();

  const handleSkillAnalysis = () => {
    router.push(`/analytics/skill-types?subject_id=${SUBJECT_ID}`);
  };

  const handleExerciseTypeAnalysis = () => {
    router.push(`/analytics/exercise-types?subject_id=${SUBJECT_ID}`);
  };

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                程度分析
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                查看您的學習成效與能力分布
              </p>
            </div>

            {/* Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 技能分析卡片 */}
              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500 dark:hover:border-blue-400"
                onClick={handleSkillAnalysis}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      技能分析
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      查看各項技能的掌握程度與學習建議
                    </p>
                  </div>
                </div>
              </Card>

              {/* 題型分析卡片 */}
              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500 dark:hover:border-green-400"
                onClick={handleExerciseTypeAnalysis}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      題型分析
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      了解各種題型的答題表現與強弱項
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
