'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingButton } from '@/components/common/LoadingButton';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { paperService } from '@/lib/api/paper';
import toast, { Toaster } from 'react-hot-toast';
import { PageHeader } from '@/components/common/PageHeader';
import { RangeSelector } from '@/components/configuration/RangeSelector';
import type { RangeSelectorValue } from '@/components/configuration/RangeSelector';

export default function PaperConfigurationPage() {
  const router = useRouter();

  // 範圍選擇器狀態
  const [rangeConfig, setRangeConfig] = useState<RangeSelectorValue>({
    grade: null,
    semester: null,
    subjectId: null,
    publisherEditionId: null,
    rangePackIds: [], // 改為陣列，支援多選
  });

  // Loading state
  const [startingPaper, setStartingPaper] = useState(false);

  // Handle start practice
  const handleStartPractice = useCallback(async () => {
    if (!rangeConfig.subjectId || rangeConfig.rangePackIds.length === 0) return;

    setStartingPaper(true);
    try {
      const response = await paperService.startPaper({
        range_pack_ids: rangeConfig.rangePackIds, // 改為傳送陣列
        subject_id: rangeConfig.subjectId,
      });

      // Navigate to paper page using paper_id (not user_paper_id)
      router.push(`/papers/${response.paper_id}`);
    } catch (error) {
      toast.error('無法開始考卷，請稍後再試');
    } finally {
      setStartingPaper(false);
    }
  }, [rangeConfig.subjectId, rangeConfig.rangePackIds, router]);

  const isButtonEnabled =
    rangeConfig.grade !== null &&
    rangeConfig.subjectId !== null &&
    rangeConfig.publisherEditionId !== null &&
    rangeConfig.rangePackIds.length > 0; // 改為檢查陣列長度

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
            {/* Header */}
            <PageHeader
              title="選取練習範圍"
              description="依序選擇年級、出版社版本和練習範圍來開始練習"
            />

            {/* Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>練習配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 範圍選擇器 */}
                <RangeSelector
                  value={rangeConfig}
                  onChange={setRangeConfig}
                  required
                />

                {/* Start Practice Button */}
                <div className="pt-4">
                  <LoadingButton
                    onClick={handleStartPractice}
                    isLoading={startingPaper}
                    disabled={!isButtonEnabled}
                    loadingText="正在生成考卷..."
                    className="w-full"
                    size="lg"
                  >
                    進入練習
                  </LoadingButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
