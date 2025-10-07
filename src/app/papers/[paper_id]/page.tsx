'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface PaperData {
  id: number;
  subject_id: string;
  name: string;
  range_pack_id: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    sequence: number;
    item_id: number;
    item_type: string;
    difficulty_bundle_id: string;
    content_json: unknown;
  }>;
  item_sets: Array<{
    sequence: number;
    item_set_id: number;
    item_set_type: string;
    difficulty_bundle_id: string;
    asset_json: unknown;
  }>;
}

export default function PaperDetailPage() {
  const params = useParams();
  const paper_id = params.paper_id as string;

  const [paper, setPaper] = useState<PaperData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/papers/${paper_id}`);

        if (!response.ok) {
          throw new Error('無法載入考卷資料');
        }

        const data = await response.json();
        setPaper(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    if (paper_id) {
      fetchPaper();
    }
  }, [paper_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="text-gray-600 dark:text-gray-400">載入考卷中...</span>
        </div>
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-500">
          <AlertCircle className="h-12 w-12" />
          <span>{error || '找不到考卷'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {paper.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            考卷 ID: {paper.id} | 科目: {paper.subject_id}
          </p>
        </div>

        {/* Paper Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>考卷資訊</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(paper, null, 2)}
              </pre>
            </CardContent>
          </Card>

          {/* Items */}
          {paper.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>單題 ({paper.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paper.items.map((item) => (
                    <div
                      key={item.item_id}
                      className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">序號: {item.sequence}</span>
                        <span className="text-sm text-gray-500">ID: {item.item_id}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>類型: {item.item_type}</p>
                        <p>難度組合: {item.difficulty_bundle_id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Item Sets */}
          {paper.item_sets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>題組 ({paper.item_sets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paper.item_sets.map((itemSet) => (
                    <div
                      key={itemSet.item_set_id}
                      className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">序號: {itemSet.sequence}</span>
                        <span className="text-sm text-gray-500">ID: {itemSet.item_set_id}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>類型: {itemSet.item_set_type}</p>
                        <p>難度組合: {itemSet.difficulty_bundle_id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
