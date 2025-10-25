/**
 * Exercise Session Configuration Page
 *
 * 刷題模式配置頁面
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/common/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useCreateSession } from '@/hooks/exerciseSession/useExerciseSession';
import { PageHeader } from '@/components/common/PageHeader';
import { RangeSelector } from '@/components/configuration/RangeSelector';
import { ExerciseTypeSelector } from '@/components/configuration/ExerciseTypeSelector';
import type { RangeSelectorValue } from '@/components/configuration/RangeSelector';

export default function ExerciseSessionConfigurationPage() {
  const router = useRouter();
  const createSession = useCreateSession();

  // 範圍選擇器狀態
  const [rangeConfig, setRangeConfig] = useState<RangeSelectorValue>({
    grade: null,
    semester: null,
    subjectId: null,
    publisherEditionId: null,
    rangePackIds: [], // 改為陣列，支援多選
  });

  // 題型選擇狀態
  const [selectedExerciseTypes, setSelectedExerciseTypes] = useState<number[]>([]);

  // 檢查表單是否完整
  const isFormValid =
    rangeConfig.subjectId !== null &&
    rangeConfig.publisherEditionId !== null &&
    rangeConfig.rangePackIds.length > 0 && // 改為檢查陣列長度
    selectedExerciseTypes.length > 0;

  // 提交表單
  const handleSubmit = () => {
    if (!isFormValid || rangeConfig.rangePackIds.length === 0 || !rangeConfig.subjectId) return;

    createSession.mutate({
      subject_id: rangeConfig.subjectId,
      range_pack_ids: rangeConfig.rangePackIds, // 改為傳送陣列
      exercise_type_ids: selectedExerciseTypes,
    });
  };

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-2xl mx-auto px-4 py-4 sm:py-8">
            {/* 返回按鈕 */}
            <BackButton
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            />

            {/* 標題 */}
            <PageHeader
              title="刷題挑戰"
              icon={<Flame className="h-8 w-8 text-orange-500" />}
              align="center"
              className="mb-6"
            />

            {/* 配置表單 */}
            <Card>
              <CardHeader>
                <CardTitle>練習設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 範圍選擇器 */}
                <RangeSelector
                  value={rangeConfig}
                  onChange={setRangeConfig}
                  required
                />

                {/* 題型選擇器 */}
                <ExerciseTypeSelector
                  value={selectedExerciseTypes}
                  onChange={setSelectedExerciseTypes}
                  required
                  minSelection={1}
                />

                {/* 提示訊息 */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ℹ️ 系統會根據你的表現自動調整難度
                  </p>
                </div>

                {/* 提交按鈕 */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || createSession.isPending}
                    className="flex-1"
                    size="lg"
                  >
                    {createSession.isPending ? '建立中...' : '開始練習'}
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    取消
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
