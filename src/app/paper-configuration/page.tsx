'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { paperService } from '@/lib/api/paper';
import { rangePackService } from '@/lib/api/rangePack';
import toast, { Toaster } from 'react-hot-toast';

const GRADES = [
  { value: 7, label: '七年級' },
  { value: 8, label: '八年級' },
  { value: 9, label: '九年級' },
];

interface SubjectOption {
  id: number;
  name: string;
}

interface RangePack {
  id: number;
  name: string;
}

export default function PaperConfigurationPage() {
  const router = useRouter();

  // Selection states
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  // Data states
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [rangePacks, setRangePacks] = useState<RangePack[]>([]);

  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingRanges, setLoadingRanges] = useState(false);
  const [startingPaper, setStartingPaper] = useState(false);

  // Fetch subjects when grade is selected
  useEffect(() => {
    if (selectedGrade === null) return;

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const data = await rangePackService.getAvailableSubjects(selectedGrade);
        setSubjects(data.subjects || []);
      } catch (error) {
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [selectedGrade]);

  // Fetch range packs when subject is selected
  useEffect(() => {
    if (selectedGrade === null || selectedSubject === null) return;

    const fetchRangePacks = async () => {
      setLoadingRanges(true);
      try {
        const data = await rangePackService.getRangePacks(parseInt(selectedSubject), selectedGrade);
        setRangePacks(data.data || []);
      } catch (error) {
        setRangePacks([]);
      } finally {
        setLoadingRanges(false);
      }
    };

    fetchRangePacks();
  }, [selectedGrade, selectedSubject]);

  // Handle grade change - reset dependent selections
  const handleGradeChange = (value: string) => {
    setSelectedGrade(parseInt(value));
    setSelectedSubject(null);
    setSelectedRange(null);
    setSubjects([]);
    setRangePacks([]);
  };

  // Handle subject change - reset dependent selections
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedRange(null);
    setRangePacks([]);
  };

  // Handle range change
  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
  };

  // Handle start practice
  // Memoize to avoid re-creating function on every render
  const handleStartPractice = useCallback(async () => {
    if (!selectedSubject || !selectedRange) return;

    setStartingPaper(true);
    try {
      const response = await paperService.startPaper({
        range_pack_id: parseInt(selectedRange),
        subject_id: parseInt(selectedSubject),
      });

      // Navigate to paper page using paper_id (not user_paper_id)
      router.push(`/papers/${response.paper_id}`);
    } catch (error) {
      toast.error('無法開始考卷，請稍後再試');
    } finally {
      setStartingPaper(false);
    }
  }, [selectedSubject, selectedRange, router]);

  const isButtonEnabled = selectedGrade !== null && selectedSubject !== null && selectedRange !== null;

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                選取練習範圍
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                依序選擇年級、科目和範圍來開始練習
              </p>
            </div>

            {/* Configuration Card */}
            <Card>
              <CardHeader>
                <CardTitle>練習配置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Grade Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    年級
                  </label>
                  <Select
                    value={selectedGrade?.toString() || ''}
                    onValueChange={handleGradeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="選擇年級" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADES.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value.toString()}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    科目
                  </label>
                  <Select
                    value={selectedSubject || ''}
                    onValueChange={handleSubjectChange}
                    disabled={!selectedGrade || loadingSubjects}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        loadingSubjects
                          ? '載入中...'
                          : selectedGrade
                            ? '選擇科目'
                            : '請先選擇年級'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={String(subject.id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingSubjects && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>載入科目中...</span>
                    </div>
                  )}
                </div>

                {/* Range Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    範圍
                  </label>
                  <Select
                    value={selectedRange || ''}
                    onValueChange={handleRangeChange}
                    disabled={!selectedSubject || loadingRanges}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={
                        loadingRanges
                          ? '載入中...'
                          : selectedSubject
                            ? '選擇範圍'
                            : '請先選擇科目'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {rangePacks.map((range) => (
                        <SelectItem key={range.id} value={String(range.id)}>
                          {range.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingRanges && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>載入範圍中...</span>
                    </div>
                  )}
                </div>

                {/* Start Practice Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleStartPractice}
                    disabled={!isButtonEnabled || startingPaper}
                    className="w-full"
                    size="lg"
                  >
                    {startingPaper ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        正在生成考卷...
                      </>
                    ) : (
                      '進入練習'
                    )}
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
