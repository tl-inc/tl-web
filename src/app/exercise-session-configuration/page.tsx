/**
 * Exercise Session Configuration Page
 *
 * 刷題模式配置頁面
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useCreateSession } from '@/hooks/exerciseSession/useExerciseSession';
import { rangePackService } from '@/lib/api/rangePack';
import { useQuery } from '@tanstack/react-query';

// 題型選項 (基礎題型: 字彙、片語、文法)
const EXERCISE_TYPES = [
  { id: 1, name: 'vocabulary', display_name: '字彙' },
  { id: 2, name: 'phrase', display_name: '片語' },
  { id: 3, name: 'grammar', display_name: '文法' },
];

export default function ExerciseSessionConfigurationPage() {
  const router = useRouter();
  const createSession = useCreateSession();

  // 表單狀態
  const [grade, setGrade] = useState<number>(7); // 預設七年級
  const [subjectId, setSubjectId] = useState<number>(1); // 預設英文
  const [rangePackId, setRangePackId] = useState<number | null>(null);
  const [selectedExerciseTypes, setSelectedExerciseTypes] = useState<number[]>(
    []
  );

  // 取得科目列表
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects', grade],
    queryFn: () => rangePackService.getAvailableSubjects(grade),
  });

  // 取得範圍包列表
  const { data: rangePacksData } = useQuery({
    queryKey: ['range-packs', subjectId, grade],
    queryFn: () => rangePackService.getRangePacks(subjectId, grade),
    enabled: !!subjectId,
  });

  // 處理題型選擇
  const toggleExerciseType = (typeId: number) => {
    setSelectedExerciseTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // 檢查表單是否完整
  const isFormValid =
    subjectId && rangePackId && selectedExerciseTypes.length > 0;

  // 提交表單
  const handleSubmit = () => {
    if (!isFormValid || !rangePackId) return;

    createSession.mutate({
      subject_id: subjectId,
      range_pack_id: rangePackId,
      exercise_type_ids: selectedExerciseTypes,
    });
  };

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container max-w-2xl mx-auto px-4 py-4 sm:py-8">
            {/* 返回按鈕 */}
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>

            {/* 標題 */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Flame className="h-8 w-8 text-orange-500" />
                <h1 className="text-3xl font-bold">刷題挑戰</h1>
              </div>
            </div>

            {/* 配置表單 */}
            <Card>
              <CardHeader>
                <CardTitle>練習設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 年級選擇 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    年級 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={grade.toString()}
                    onValueChange={(value) => setGrade(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="選擇年級" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">七年級</SelectItem>
                      <SelectItem value="8">八年級</SelectItem>
                      <SelectItem value="9">九年級</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 科目選擇 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    選擇科目 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={subjectId.toString()}
                    onValueChange={(value) => setSubjectId(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="選擇科目" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectsData?.subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 範圍包選擇 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    選擇練習範圍 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={rangePackId?.toString() || ''}
                    onValueChange={(value) => setRangePackId(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="請選擇範圍" />
                    </SelectTrigger>
                    <SelectContent>
                      {rangePacksData?.data.map((pack) => (
                        <SelectItem key={pack.id} value={pack.id.toString()}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 題型選擇 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    選擇題型 <span className="text-red-500">*</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      (至少選一種)
                    </span>
                  </label>
                  <div className="space-y-2">
                    {EXERCISE_TYPES.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={selectedExerciseTypes.includes(type.id)}
                          onChange={() => toggleExerciseType(type.id)}
                          className="w-4 h-4"
                        />
                        <span className="flex-1">{type.display_name}</span>
                      </label>
                    ))}
                  </div>
                </div>

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
