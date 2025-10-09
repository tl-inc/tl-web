'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { EngMcqText } from '@/components/items/EngMcqText';
import { EngCloze } from '@/components/items/EngCloze';
import { EngImageMcq } from '@/components/item-sets/EngImageMcq';
import { EngNarrativeReadingSet } from '@/components/item-sets/EngNarrativeReadingSet';
import { EngInfoReadingMenu } from '@/components/item-sets/EngInfoReadingMenu';
import { EngInfoReadingNotice } from '@/components/item-sets/EngInfoReadingNotice';
import { EngInfoReadingSchedule } from '@/components/item-sets/EngInfoReadingSchedule';
import { EngListening } from '@/components/item-sets/EngListening';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SidebarLayout } from '@/components/layout/SidebarLayout';

interface PaperItem {
  sequence: number;
  item_id: number;
  item_type: string;
  difficulty_bundle_id: string;
  content_json: unknown;
}

interface SubItem {
  id: number;
  sequence: number;
  content_json: any;
  answer: string;
}

interface PaperItemSet {
  sequence: number;
  item_set_id: number;
  item_set_type: string;
  difficulty_bundle_id: string;
  asset_json: unknown;
  items?: SubItem[];
}

interface PaperData {
  id: number;
  subject_id: string;
  name: string;
  range_pack_id: string;
  created_at: string;
  updated_at: string;
  items: PaperItem[];
  item_sets: PaperItemSet[];
}

export default function PaperDetailPage() {
  const params = useParams();
  const paper_id = params.paper_id as string;

  const [paper, setPaper] = useState<PaperData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  // Answer states
  const [itemAnswers, setItemAnswers] = useState<Map<number, number>>(new Map());
  const [clozeAnswers, setClozeAnswers] = useState<Map<number, Map<number, number>>>(new Map());
  const [itemSetAnswers, setItemSetAnswers] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/papers/${paper_id}`);

        if (!response.ok) {
          throw new Error('無法載入考卷資料');
        }

        const data = await response.json();

        // Normalize asset_json: parse strings to objects
        if (data.item_sets) {
          data.item_sets = data.item_sets.map((itemSet: any) => {
            if (itemSet.asset_json && typeof itemSet.asset_json === 'string') {
              try {
                itemSet.asset_json = JSON.parse(itemSet.asset_json);
              } catch (e) {
                console.error('Failed to parse asset_json:', e);
              }
            }
            return itemSet;
          });
        }

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

  const handleItemAnswer = (itemId: number, answer: number | null) => {
    setItemAnswers(prev => {
      const newAnswers = new Map(prev);
      if (answer === null) {
        newAnswers.delete(itemId);
      } else {
        newAnswers.set(itemId, answer);
      }
      return newAnswers;
    });
  };

  const handleClozeAnswer = (itemId: number, blankNumber: number, answerIndex: number | null) => {
    setClozeAnswers(prev => {
      const newAnswers = new Map(prev);
      const itemAnswers = newAnswers.get(itemId) || new Map();

      if (answerIndex === null) {
        itemAnswers.delete(blankNumber);
      } else {
        itemAnswers.set(blankNumber, answerIndex);
      }

      newAnswers.set(itemId, itemAnswers);
      return newAnswers;
    });
  };

  const handleItemSetAnswer = (subItemId: number, answer: number | null) => {
    setItemSetAnswers(prev => {
      const newAnswers = new Map(prev);
      if (answer === null) {
        newAnswers.delete(subItemId);
      } else {
        newAnswers.set(subItemId, answer);
      }
      return newAnswers;
    });
  };

  // Calculate score
  const calculateScore = () => {
    if (!paper) return { score: 0, total: 0, correct: 0, percentage: 0 };

    let correctCount = 0;
    let totalQuestions = 0;

    // Count items (single questions or cloze)
    paper.items.forEach(item => {
      if (item.item_type === 'eng_mcq_text') {
        totalQuestions++;
        const userAnswer = itemAnswers.get(item.item_id);
        const content = item.content_json as any;
        if (userAnswer === content.answer_index) {
          correctCount++;
        }
      } else if (item.item_type === 'eng_cloze') {
        const content = item.content_json as any;
        const itemUserAnswers = clozeAnswers.get(item.item_id) || new Map();

        content.answers.forEach((answer: any) => {
          totalQuestions++;
          const userAnswer = itemUserAnswers.get(answer.blank_number);
          if (userAnswer === answer.answer_index) {
            correctCount++;
          }
        });
      }
    });

    // Count item set sub-items
    paper.item_sets.forEach(itemSet => {
      if (itemSet.items) {
        itemSet.items.forEach(subItem => {
          totalQuestions++;
          const userAnswer = itemSetAnswers.get(subItem.id);
          if (userAnswer === subItem.content_json.answer_index) {
            correctCount++;
          }
        });
      }
    });

    const pointsPerQuestion = totalQuestions > 0 ? 100 / totalQuestions : 0;
    const score = correctCount * pointsPerQuestion;
    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return {
      score: Math.round(score * 10) / 10, // Round to 1 decimal place
      total: totalQuestions,
      correct: correctCount,
      percentage: Math.round(percentage * 10) / 10
    };
  };

  const scoreData = showAnswers ? calculateScore() : null;

  const renderItem = (item: PaperItem, displaySequence: number) => {
    switch (item.item_type) {
      case 'eng_mcq_text':
        return (
          <EngMcqText
            key={`item-${item.item_id}`}
            sequence={displaySequence}
            content={item.content_json as any}
            userAnswer={itemAnswers.get(item.item_id)}
            onAnswerChange={(answer) => handleItemAnswer(item.item_id, answer)}
            showAnswer={showAnswers}
          />
        );
      case 'eng_cloze':
        return (
          <EngCloze
            key={`item-${item.item_id}`}
            sequence={displaySequence}
            content={item.content_json as any}
            userAnswers={clozeAnswers.get(item.item_id)}
            onAnswerChange={(blankNumber, answer) => handleClozeAnswer(item.item_id, blankNumber, answer)}
            showAnswer={showAnswers}
          />
        );
      default:
        return (
          <div key={`item-${item.item_id}`} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            Unknown item type: {item.item_type}
          </div>
        );
    }
  };

  const renderItemSet = (itemSet: PaperItemSet, displaySequence: number) => {
    const hasSubItems = itemSet.items && itemSet.items.length > 0;

    // Common sub-items renderer
    const renderSubItems = () => {
      if (!hasSubItems) return null;
      return itemSet.items!.map((item, index) => (
        <EngMcqText
          key={item.id}
          sequence={displaySequence}
          subItemNumber={index + 1}
          content={item.content_json}
          userAnswer={itemSetAnswers.get(item.id)}
          onAnswerChange={(answer) => handleItemSetAnswer(item.id, answer)}
          showAnswer={showAnswers}
        />
      ));
    };

    switch (itemSet.item_set_type) {
      case 'eng_listening':
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="space-y-6">
            <EngListening
              sequence={displaySequence}
              asset={itemSet.asset_json as any}
              items={itemSet.items}
              userAnswers={itemSetAnswers}
              onAnswerChange={handleItemSetAnswer}
              showAnswer={showAnswers}
            />
          </div>
        );

      case 'eng_image_mcq':
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="space-y-6">
            <EngImageMcq sequence={displaySequence} asset={itemSet.asset_json as any} />
            {renderSubItems()}
          </div>
        );

      case 'eng_narrative_reading_set':
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="space-y-6">
            <EngNarrativeReadingSet sequence={displaySequence} asset={itemSet.asset_json as any} />
            {renderSubItems()}
          </div>
        );

      case 'eng_info_reading_menu':
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="space-y-6">
            <EngInfoReadingMenu sequence={displaySequence} asset={itemSet.asset_json as any} />
            {renderSubItems()}
          </div>
        );

      case 'eng_info_reading_notice':
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="space-y-6">
            <EngInfoReadingNotice sequence={displaySequence} asset={itemSet.asset_json as any} />
            {renderSubItems()}
          </div>
        );

      case 'eng_info_reading_schedule':
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="space-y-6">
            <EngInfoReadingSchedule sequence={displaySequence} asset={itemSet.asset_json as any} />
            {renderSubItems()}
          </div>
        );

      default:
        return (
          <div key={`itemset-${itemSet.item_set_id}`} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            Unknown item set type: {itemSet.item_set_type}
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <SidebarLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {paper.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600 dark:text-gray-400">
                <span>考卷 ID: {paper.id}</span>
                <span className="hidden sm:inline">|</span>
                <span>科目: {paper.subject_id}</span>
                <span className="hidden sm:inline">|</span>
                <span>範圍: {paper.range_pack_id}</span>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {showAnswers ? '隱藏解答' : '顯示解答'}
                </button>
                {showAnswers && scoreData && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 dark:border-blue-400 shadow-md">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {scoreData.score}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">分數</div>
                      </div>
                      <div className="hidden sm:block w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">答對：</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {scoreData.correct}/{scoreData.total}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-400">正確率：</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {scoreData.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Paper Content - Sections */}
            <div className="space-y-8">
              {/* Items Section */}
              {paper.items.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-700 pb-2">
                    單選題
                  </h2>
                  <div className="space-y-6">
                    {paper.items
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((item, index) => renderItem(item, index + 1))}
                  </div>
                </div>
              )}

              {/* Item Sets Section */}
              {paper.item_sets.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-700 pb-2">
                    題組
                  </h2>
                  <div className="space-y-6">
                    {paper.item_sets
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((itemSet, index) => renderItemSet(itemSet, index + 1))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {paper.items.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">單題</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {paper.item_sets.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">題組</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {paper.items.length + paper.item_sets.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">總計</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    </ProtectedRoute>
  );
}
