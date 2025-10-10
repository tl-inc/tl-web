'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertCircle, Clock, ChevronDown } from 'lucide-react';
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
import { PaperData, UserPaperResponse, UserPaperStatus } from '@/types/paper';

export default function PaperDetailPage() {
  const params = useParams();
  const paper_id = params.paper_id as string;

  // Data states
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [userPapers, setUserPapers] = useState<UserPaperResponse[]>([]);
  const [activeUserPaper, setActiveUserPaper] = useState<UserPaperResponse | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Answer states
  const [itemAnswers, setItemAnswers] = useState<Map<number, number>>(new Map());
  const [clozeAnswers, setClozeAnswers] = useState<Map<number, Map<number, number>>>(new Map());
  const [itemSetAnswers, setItemSetAnswers] = useState<Map<number, number>>(new Map());

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  // Fetch paper and user_papers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch paper data
        const paperResponse = await fetch(`${apiUrl}/papers/${paper_id}`);
        if (!paperResponse.ok) throw new Error('無法載入考卷資料');
        const paperData = await paperResponse.json();

        // Normalize asset_json
        if (paperData.item_sets) {
          paperData.item_sets = paperData.item_sets.map((itemSet: any) => {
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
        setPaper(paperData);

        // Fetch user_papers for this paper
        const token = localStorage.getItem('access_token');
        const userPapersResponse = await fetch(`${apiUrl}/user-papers/by-paper/${paper_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (userPapersResponse.ok) {
          const userPapersData = await userPapersResponse.json();
          console.log('User papers data:', userPapersData);
          setUserPapers(userPapersData);

          // Select active user_paper: prioritize in_progress > pending > most recent completed/abandoned
          const active = selectActiveUserPaper(userPapersData);
          console.log('Active user paper:', active);
          setActiveUserPaper(active);

          // Set read-only mode if completed/abandoned
          if (active && (active.status === 'completed' || active.status === 'abandoned')) {
            setShowAnswers(true);
            // Load user answers for completed/abandoned papers
            loadUserAnswers(active.id);
          }
        } else {
          console.error('Failed to fetch user papers:', userPapersResponse.status);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    if (paper_id) {
      fetchData();
    }
  }, [paper_id]);

  // Load user answers from backend
  const loadUserAnswers = async (userPaperId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${userPaperId}/review`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const reviewData = await response.json();

        // Load item answers
        const newItemAnswers = new Map<number, number>();
        const newClozeAnswers = new Map<number, Map<number, number>>();

        reviewData.items.forEach((item: any) => {
          if (item.user_answer) {
            if (item.item_type === 'eng_cloze' && item.user_answer.answers) {
              // Cloze test answers
              const clozeMap = new Map<number, number>();
              Object.entries(item.user_answer.answers).forEach(([blankNum, answerIdx]) => {
                clozeMap.set(Number(blankNum), answerIdx as number);
              });
              newClozeAnswers.set(item.item_id, clozeMap);
            } else if (item.user_answer.selected_index !== undefined) {
              // MCQ answers
              newItemAnswers.set(item.item_id, item.user_answer.selected_index);
            }
          }
        });

        // Load item_set answers
        const newItemSetAnswers = new Map<number, number>();
        reviewData.item_sets.forEach((itemSet: any) => {
          if (itemSet.user_answer) {
            // item_set answers are stored as {sub_item_id: {selected_index: value}}
            Object.entries(itemSet.user_answer).forEach(([subItemId, answer]: [string, any]) => {
              if (answer.selected_index !== undefined) {
                newItemSetAnswers.set(Number(subItemId), answer.selected_index);
              }
            });
          }
        });

        setItemAnswers(newItemAnswers);
        setClozeAnswers(newClozeAnswers);
        setItemSetAnswers(newItemSetAnswers);
      }
    } catch (err) {
      console.error('Failed to load user answers:', err);
    }
  };

  const selectActiveUserPaper = (userPapers: UserPaperResponse[]): UserPaperResponse | null => {
    if (userPapers.length === 0) return null;

    // Priority: in_progress > pending > most recent completed/abandoned
    const inProgress = userPapers.find(up => up.status === 'in_progress');
    if (inProgress) return inProgress;

    const pending = userPapers.find(up => up.status === 'pending');
    if (pending) return pending;

    // Return most recent (already sorted by created_at desc from API)
    return userPapers[0];
  };

  const handleStartPaper = async () => {
    if (!activeUserPaper) return;

    // Update local state to in_progress to show buttons immediately
    // The actual backend transition will happen on first answer
    setActiveUserPaper({
      ...activeUserPaper,
      status: 'in_progress',
      started_at: new Date().toISOString()
    });
  };

  const handleCompletePaper = async () => {
    if (!activeUserPaper) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Refresh user_papers to get updated data
        const userPapersResponse = await fetch(`${apiUrl}/user-papers/by-paper/${paper_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userPapersResponse.ok) {
          const userPapersData = await userPapersResponse.json();
          setUserPapers(userPapersData);
          const completed = userPapersData.find((up: UserPaperResponse) => up.id === activeUserPaper.id);
          if (completed) setActiveUserPaper(completed);
        }
        setShowAnswers(true);
        alert(`考卷已完成！得分：${result.total_score}/${result.max_score}`);
      }
    } catch (err) {
      console.error('Failed to complete paper:', err);
    }
  };

  const handleAbandonPaper = async () => {
    if (!activeUserPaper) return;
    if (!confirm('確定要放棄此次作答嗎？')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/abandon`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updated = await response.json();
        setActiveUserPaper(updated);
        setUserPapers(prev => prev.map(up => up.id === updated.id ? updated : up));
        setShowAnswers(true);
        alert('已放棄此次作答');
      }
    } catch (err) {
      console.error('Failed to abandon paper:', err);
    }
  };

  const handleItemAnswer = async (itemId: number, paperItemSequence: number, answer: number | null) => {
    setItemAnswers(prev => {
      const newAnswers = new Map(prev);
      if (answer === null) {
        newAnswers.delete(itemId);
      } else {
        newAnswers.set(itemId, answer);
      }
      return newAnswers;
    });

    // Save to backend immediately if paper is pending or in_progress
    if (activeUserPaper && (activeUserPaper.status === 'pending' || activeUserPaper.status === 'in_progress')) {
      try {
        const token = localStorage.getItem('access_token');
        const wasPending = activeUserPaper.status === 'pending';

        await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/items/answer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_id: itemId,
            paper_item_id: paperItemSequence,
            answer: { selected_index: answer },
            time_spent: null
          })
        });

        // If it was pending, refresh to get updated status (should now be in_progress)
        if (wasPending) {
          const userPapersResponse = await fetch(`${apiUrl}/user-papers/by-paper/${paper_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userPapersResponse.ok) {
            const userPapersData = await userPapersResponse.json();
            setUserPapers(userPapersData);
            const updated = userPapersData.find((up: UserPaperResponse) => up.id === activeUserPaper.id);
            if (updated) setActiveUserPaper(updated);
          }
        }
      } catch (err) {
        console.error('Failed to save answer:', err);
      }
    }
  };

  const handleClozeAnswer = async (itemId: number, paperItemSequence: number, blankNumber: number, answerIndex: number | null) => {
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

    // Save to backend immediately if paper is pending or in_progress
    if (activeUserPaper && (activeUserPaper.status === 'pending' || activeUserPaper.status === 'in_progress')) {
      try {
        const token = localStorage.getItem('access_token');
        const wasPending = activeUserPaper.status === 'pending';

        // Get current answers for this item
        const currentAnswers = clozeAnswers.get(itemId) || new Map();
        const updatedAnswers = new Map(currentAnswers);

        if (answerIndex === null) {
          updatedAnswers.delete(blankNumber);
        } else {
          updatedAnswers.set(blankNumber, answerIndex);
        }

        // Convert Map to object {blankNumber: answerIndex}
        const answersObject: Record<number, number> = {};
        updatedAnswers.forEach((value, key) => {
          answersObject[key] = value;
        });

        await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/items/answer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_id: itemId,
            paper_item_id: paperItemSequence,
            answer: { answers: answersObject },
            time_spent: null
          })
        });

        // If it was pending, refresh to get updated status (should now be in_progress)
        if (wasPending) {
          const userPapersResponse = await fetch(`${apiUrl}/user-papers/by-paper/${paper_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userPapersResponse.ok) {
            const userPapersData = await userPapersResponse.json();
            setUserPapers(userPapersData);
            const updated = userPapersData.find((up: UserPaperResponse) => up.id === activeUserPaper.id);
            if (updated) setActiveUserPaper(updated);
          }
        }
      } catch (err) {
        console.error('Failed to save cloze answer:', err);
      }
    }
  };

  const handleItemSetAnswer = async (subItemId: number, itemSetId: number, paperItemSetSequence: number, answer: number | null) => {
    setItemSetAnswers(prev => {
      const newAnswers = new Map(prev);
      if (answer === null) {
        newAnswers.delete(subItemId);
      } else {
        newAnswers.set(subItemId, answer);
      }
      return newAnswers;
    });

    // Save to backend immediately if paper is pending or in_progress
    if (activeUserPaper && (activeUserPaper.status === 'pending' || activeUserPaper.status === 'in_progress')) {
      try {
        const token = localStorage.getItem('access_token');
        const wasPending = activeUserPaper.status === 'pending';

        await fetch(`${apiUrl}/user-papers/${activeUserPaper.id}/item-sets/answer`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item_set_id: itemSetId,
            paper_item_set_id: paperItemSetSequence,
            answer: { [subItemId]: { selected_index: answer } },
            time_spent: null
          })
        });

        // If it was pending, refresh to get updated status (should now be in_progress)
        if (wasPending) {
          const userPapersResponse = await fetch(`${apiUrl}/user-papers/by-paper/${paper_id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userPapersResponse.ok) {
            const userPapersData = await userPapersResponse.json();
            setUserPapers(userPapersData);
            const updated = userPapersData.find((up: UserPaperResponse) => up.id === activeUserPaper.id);
            if (updated) setActiveUserPaper(updated);
          }
        }
      } catch (err) {
        console.error('Failed to save item set answer:', err);
      }
    }
  };

  // Get score data from backend (activeUserPaper)
  const scoreData = showAnswers && activeUserPaper?.status === 'completed' ? {
    score: activeUserPaper.score || 0,
    max_score: activeUserPaper.max_score || 0,
    percentage: activeUserPaper.max_score && activeUserPaper.max_score > 0
      ? Math.round((activeUserPaper.score || 0) / activeUserPaper.max_score * 100)
      : 0
  } : null;
  const isReadOnly = activeUserPaper?.status === 'completed' || activeUserPaper?.status === 'abandoned';
  const isPending = activeUserPaper?.status === 'pending';
  const isInProgress = activeUserPaper?.status === 'in_progress';

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

  const renderItem = (item: any, displaySequence: number) => {
    switch (item.item_type) {
      case 'eng_mcq_text':
      case 'eng_mcq_lexicon':
      case 'eng_mcq_phrase':
      case 'eng_mcq_grammar':
        return (
          <EngMcqText
            key={`item-${item.item_id}`}
            sequence={displaySequence}
            content={item.content_json as any}
            userAnswer={itemAnswers.get(item.item_id)}
            onAnswerChange={(answer) => handleItemAnswer(item.item_id, item.sequence, answer)}
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
            onAnswerChange={(blankNumber, answer) => handleClozeAnswer(item.item_id, item.sequence, blankNumber, answer)}
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

  const renderItemSet = (itemSet: any, displaySequence: number) => {
    const hasSubItems = itemSet.items && itemSet.items.length > 0;

    const renderSubItems = () => {
      if (!hasSubItems) return null;
      return itemSet.items!.map((item: any, index: number) => (
        <EngMcqText
          key={item.id}
          sequence={displaySequence}
          subItemNumber={index + 1}
          content={item.content_json}
          userAnswer={itemSetAnswers.get(item.id)}
          onAnswerChange={(answer) => handleItemSetAnswer(item.id, itemSet.item_set_id, itemSet.sequence, answer)}
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
              onAnswerChange={(subItemId: number, answer: number | null) =>
                handleItemSetAnswer(subItemId, itemSet.item_set_id, itemSet.sequence, answer)
              }
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

              {/* Status and Controls */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Status Badge */}
                {activeUserPaper && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeUserPaper.status === 'pending' ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                    activeUserPaper.status === 'in_progress' ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300' :
                    activeUserPaper.status === 'completed' ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300' :
                    'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300'
                  }`}>
                    {activeUserPaper.status === 'pending' ? '未開始' :
                     activeUserPaper.status === 'in_progress' ? '作答中' :
                     activeUserPaper.status === 'completed' ? '已完成' : '已放棄'}
                  </div>
                )}

                {/* Action Buttons */}
                {isPending && (
                  <button
                    onClick={handleStartPaper}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    開始作答
                  </button>
                )}

                {isInProgress && (
                  <>
                    <button
                      onClick={handleCompletePaper}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      完成考卷
                    </button>
                    <button
                      onClick={handleAbandonPaper}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      放棄作答
                    </button>
                  </>
                )}

                {isReadOnly && (
                  <button
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    {showAnswers ? '隱藏解答' : '顯示解答'}
                  </button>
                )}

                {/* Score Display */}
                {showAnswers && scoreData && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 dark:border-blue-400 shadow-md">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">分數</div>
                        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                          {scoreData.percentage}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">答對題數</div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {Math.round(scoreData.score)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">總題數</div>
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {Math.round(scoreData.max_score)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* History Dropdown */}
                {userPapers.length > 1 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Clock className="h-4 w-4" />
                      歷史作答 ({userPapers.length})
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {showHistoryDropdown && (
                      <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[250px]">
                        {userPapers.map((up, index) => (
                          <button
                            key={up.id}
                            onClick={() => {
                              setActiveUserPaper(up);
                              setShowHistoryDropdown(false);
                              if (up.status === 'completed' || up.status === 'abandoned') {
                                setShowAnswers(true);
                                loadUserAnswers(up.id);
                              } else {
                                // Clear answers when switching to pending/in_progress
                                setShowAnswers(false);
                                setItemAnswers(new Map());
                                setClozeAnswers(new Map());
                                setItemSetAnswers(new Map());
                              }
                            }}
                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                              index === 0 ? 'rounded-t-lg' : ''
                            } ${index === userPapers.length - 1 ? 'rounded-b-lg' : 'border-b border-gray-200 dark:border-gray-700'} ${
                              activeUserPaper?.id === up.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {up.status === 'pending' && '未開始'}
                              {up.status === 'in_progress' && '作答中'}
                              {up.status === 'completed' && `已完成 - ${up.score}/${up.max_score}`}
                              {up.status === 'abandoned' && '已放棄'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(up.created_at).toLocaleString('zh-TW')}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Paper Content */}
            <div className="space-y-8">
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

            {/* Bottom Action Buttons */}
            {isInProgress && (
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleCompletePaper}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium cursor-pointer"
                >
                  完成考卷
                </button>
                <button
                  onClick={handleAbandonPaper}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium cursor-pointer"
                >
                  放棄考卷
                </button>
              </div>
            )}

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
