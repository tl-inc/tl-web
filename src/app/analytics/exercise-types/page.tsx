'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ExerciseTypeRadarChart } from '@/components/analytics/ExerciseTypeRadarChart';
import { analyticsService } from '@/lib/api/analytics';

const SUBJECT_ID = 1; // 英文科目 (目前系統只有英文)

export default function ExerciseTypesAnalyticsPage() {
  const router = useRouter();
  // 目前只支援英文,直接使用固定 ID
  const subjectId = SUBJECT_ID;

  const handleBack = () => {
    router.push('/analytics');
  };

  // 使用 React Query 獲取題型分組資料
  const {
    data: analyticsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['exercise-type-groups', subjectId],
    queryFn: () => analyticsService.getExerciseTypeGroups(subjectId),
    staleTime: 5 * 60 * 1000, // 5 分鐘
  });

  const handleExerciseTypeClick = (_exerciseTypeId: number) => {
    // 未來可以導向該題型的詳細分析頁面
    // TODO: Implement navigation to exercise type detail page
  };

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-6 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回程度分析
            </Button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
                題型分析
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
                查看各題型的等級與表現
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  載入中...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-600 dark:text-red-400 mb-4">
                  載入失敗,請稍後再試
                </p>
                <Button onClick={() => window.location.reload()}>重新載入</Button>
              </div>
            )}

            {/* Content */}
            {!isLoading && !error && analyticsData && (
              <div className="space-y-6">
                {analyticsData.groups.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      尚無題型資料
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      完成練習後即可查看統計
                    </p>
                  </div>
                ) : (
                  analyticsData.groups.map((group) => {
                    // 計算該分組的最大 max_level
                    const maxLevel =
                      group.exercise_types.length > 0
                        ? Math.max(
                            ...group.exercise_types.map((et) => et.max_level)
                          )
                        : 5;

                    return (
                      <Card
                        key={group.id}
                        className="border-2 hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
                            {group.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            等級範圍: 1 (初級) ~ {maxLevel} (精通)
                          </p>
                        </CardHeader>
                        <CardContent>
                          <ExerciseTypeRadarChart
                            group={group}
                            onExerciseTypeClick={handleExerciseTypeClick}
                          />
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </main>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
