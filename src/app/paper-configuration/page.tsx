'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useItemDifficultyBundles, useItemSetDifficultyBundles } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, AlertCircle, FileText, Layers, ChevronDown, Sparkles } from 'lucide-react';
import type { ItemDifficultyBundle, ItemSetDifficultyBundle } from '@/types/api';

const DIFFICULTY_LEVELS = [
  { value: '1', label: 'Level 1 - 最簡單' },
  { value: '2', label: 'Level 2 - 簡單' },
  { value: '3', label: 'Level 3 - 中等' },
  { value: '4', label: 'Level 4 - 困難' },
  { value: '5', label: 'Level 5 - 最困難' },
];

// 參數 key 中英對照表
const PARAM_TRANSLATIONS: Record<string, string> = {
  // 通用參數
  'blank_count': '填空數量',
  'context_clues': '上下文提示',
  'grammar_focus': '文法重點',
  'distractor_count': '干擾選項數',
  'vocabulary_level': '詞彙難度',
  'passage_word_count': '文章字數',
  'item_count': '題目數量',
  'scene_types': '場景類型',
  'detail_level': '細節程度',
  'question_type': '問題類型',
  'question_types': '問題類型',
  'image_complexity': '圖片複雜度',
  'distractor_difficulty': '干擾選項難度',
  'passage_length': '文章長度',
  'passage_complexity': '文章複雜度',
  'inference_level': '推論程度',
  'answer_type': '答案類型',
  'audio_length': '音訊長度',
  'audio_complexity': '音訊複雜度',
  'speech_rate': '語速',
  'background_noise': '背景噪音',
  'accent_type': '口音類型',
  'min_options': '最少選項數',
  'max_options': '最多選項數',
  'allow_multiple': '允許多選',
  'sentence_complexity': '句子複雜度',
  'word_count': '字數',
  'min_word_count': '最少字數',
  'max_word_count': '最多字數',
  'tense_focus': '時態重點',
  'structure_focus': '結構重點',
};

export default function PaperConfigurationPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState('1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 抓取所有難度資料
  const { data: itemBundles, isLoading: itemBundlesLoading } = useItemDifficultyBundles(1, 100);
  const { data: itemSetBundles, isLoading: itemSetBundlesLoading } = useItemSetDifficultyBundles(1, 100);

  const isLoading = itemBundlesLoading || itemSetBundlesLoading;

  // 隨機出題處理函數
  const handleGeneratePaper = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/difficulty-papers?level=${selectedLevel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '生成考卷失敗');
      }

      const data = await response.json();
      // 成功後跳轉到考卷頁面
      router.push(`/papers/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
      setIsGenerating(false);
    }
  };

  // 根據選定的 level 過濾資料
  const filteredData = useMemo(() => {
    const level = parseInt(selectedLevel);

    const items = itemBundles?.bundles?.filter(bundle => bundle.level === level) || [];
    const itemSets = itemSetBundles?.bundles?.filter(bundle => bundle.level === level) || [];

    return { items, itemSets };
  }, [selectedLevel, itemBundles, itemSetBundles]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            考卷設定
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            選擇難度等級以查看對應的題目參數設定
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">難度等級</CardTitle>
              <CardDescription>選擇考卷的難度等級</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full sm:w-80">
                    <SelectValue placeholder="選擇難度等級" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleGeneratePaper}
                  disabled={isGenerating}
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      隨機出題
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats - 移到選擇器下方 */}
        {!isLoading && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">統計資訊</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="單題設定數量"
                  value={filteredData.items.length}
                  color="blue"
                />
                <StatCard
                  label="題組設定數量"
                  value={filteredData.itemSets.length}
                  color="green"
                />
                <StatCard
                  label="總設定數量"
                  value={filteredData.items.length + filteredData.itemSets.length}
                  color="purple"
                />
                <StatCard
                  label="難度等級"
                  value={`Level ${selectedLevel}`}
                  color="orange"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">載入中...</span>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Item Difficulty Bundles */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <CardTitle>單題難度設定</CardTitle>
                </div>
                <CardDescription>
                  Item Difficulty Bundles (Level {selectedLevel})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredData.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p>此難度等級沒有單題設定</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredData.items.map((bundle) => (
                      <DifficultyBundleCard key={bundle.id} bundle={bundle} type="item" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Item Set Difficulty Bundles */}
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-green-500" />
                  <CardTitle>題組難度設定</CardTitle>
                </div>
                <CardDescription>
                  Item Set Difficulty Bundles (Level {selectedLevel})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredData.itemSets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p>此難度等級沒有題組設定</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredData.itemSets.map((bundle) => (
                      <DifficultyBundleCard key={bundle.id} bundle={bundle} type="itemSet" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

// Difficulty Bundle Card Component
function DifficultyBundleCard({
  bundle,
  type
}: {
  bundle: ItemDifficultyBundle | ItemSetDifficultyBundle;
  type: 'item' | 'itemSet'
}) {
  const [isParamsOpen, setIsParamsOpen] = useState(false);
  const hasParams = bundle.params && Object.keys(bundle.params).length > 0;

  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
            {bundle.name || bundle.id}
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 whitespace-nowrap">
            Level {bundle.level}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
          {type === 'item'
            ? (bundle as ItemDifficultyBundle).item_type
            : (bundle as ItemSetDifficultyBundle).item_set_type}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <DetailRow label="Subject" value={bundle.subject_id} />

        {bundle.min_skill_count !== null && bundle.max_skill_count !== null && (
          <DetailRow
            label="Skill Count"
            value={`${bundle.min_skill_count} - ${bundle.max_skill_count}`}
          />
        )}

        {/* Parameters - Collapsible */}
        {hasParams && (
          <Collapsible open={isParamsOpen} onOpenChange={setIsParamsOpen}>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between w-full group">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    參數設定
                    <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">
                      ({Object.keys(bundle.params).length} 項)
                    </span>
                  </p>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                      isParamsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="space-y-1">
                  {Object.entries(bundle.params).map(([key, value]) => (
                    <DetailRow
                      key={key}
                      label={key}
                      value={formatParamValue(value)}
                      isParam={true}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
      </div>
    </div>
  );
}

// Detail Row Component
function DetailRow({
  label,
  value,
  mono = false,
  isParam = false
}: {
  label: string;
  value: string | number | React.ReactNode;
  mono?: boolean;
  isParam?: boolean;
}) {
  // 翻譯參數 key
  const translatedLabel = isParam ? (PARAM_TRANSLATIONS[label] || label) : label;

  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-gray-600 dark:text-gray-400 text-xs shrink-0">
        {translatedLabel}:
      </span>
      <span className={`text-gray-900 dark:text-gray-100 text-xs text-right ${mono ? 'font-mono' : ''} break-words`}>
        {value}
      </span>
    </div>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  color
}: {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
  };

  return (
    <div className={`rounded-lg p-4 ${colorClasses[color]}`}>
      <p className="text-xs opacity-80 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Helper function to format parameter values
function formatParamValue(value: unknown): string | React.ReactNode {
  // 處理 null 和 undefined
  if (value === null || value === undefined) {
    return '-';
  }

  // 處理布林值
  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }

  // 處理陣列
  if (Array.isArray(value)) {
    // 如果是簡單陣列（字串或數字），用逗號分隔
    if (value.every(item => typeof item === 'string' || typeof item === 'number')) {
      return value.join(', ');
    }
    // 如果是複雜陣列（包含物件），格式化為 JSON
    return (
      <pre className="text-xs mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // 處理物件
  if (typeof value === 'object') {
    return (
      <pre className="text-xs mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // 處理數字和字串
  return String(value);
}
