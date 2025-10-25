/**
 * RangeSelector Component
 * 範圍選擇器組件 - 支援跨年級跨學期多選範圍包
 */
'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle2, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { rangePackService } from '@/lib/api/rangePack';
import type { RangeSelectorProps, GradeSemesterOption, RangePackOption } from './types';

// 年級學期選項常量
const GRADE_SEMESTER_OPTIONS: GradeSemesterOption[] = [
  { grade: 7, semester: 1, label: '七上' },
  { grade: 7, semester: 2, label: '七下' },
  { grade: 8, semester: 1, label: '八上' },
  { grade: 8, semester: 2, label: '八下' },
  { grade: 9, semester: 1, label: '九上' },
  { grade: 9, semester: 2, label: '九下' },
];

// 選擇數量限制
const MIN_SELECTION = 1;
const MAX_SELECTION = 10;

/**
 * 範圍選擇器組件
 *
 * 特性：
 * - 受控組件模式
 * - 級聯選擇（出版社版本 → 年級學期 → 範圍包）
 * - 支援跨年級、跨學期多選範圍包（1-10個）
 * - 自動處理 loading 狀態
 * - 使用 TanStack Query 管理 API 請求
 *
 * @example
 * ```tsx
 * const [config, setConfig] = useState({
 *   grade: null,
 *   semester: null,
 *   subjectId: null,
 *   publisherEditionId: null,
 *   rangePackIds: []
 * });
 *
 * <RangeSelector
 *   value={config}
 *   onChange={setConfig}
 *   required
 * />
 * ```
 */
export function RangeSelector({
  value,
  onChange,
  required = false,
  disabled = false,
  className,
}: RangeSelectorProps) {
  // 從 value 解構出當前選擇
  const { grade, semester, subjectId, publisherEditionId, rangePackIds } = value;

  // 內部狀態：儲存已選 range packs 的完整資訊（用於顯示 tags）
  const [selectedRangePacksMap, setSelectedRangePacksMap] = useState<Map<number, RangePackOption>>(
    new Map()
  );

  // 初始化：自動設定英文科（subjectId = 1）
  useEffect(() => {
    if (subjectId === null) {
      onChange({
        ...value,
        subjectId: 1, // 自動設定為英文科
      });
    }
  }, [subjectId, onChange, value]);

  // 取得出版社版本列表（固定使用英文科 subjectId = 1）
  const {
    data: publisherEditionsData,
    isLoading: isLoadingPublisherEditions,
  } = useQuery({
    queryKey: ['publisher-editions', 1], // 固定英文科
    queryFn: () => rangePackService.getPublisherEditions(1),
    enabled: true, // 總是啟用
  });

  // 取得範圍包列表
  const {
    data: rangePacksData,
    isLoading: isLoadingRangePacks,
  } = useQuery({
    queryKey: ['range-packs', publisherEditionId, subjectId, grade, semester],
    queryFn: () => rangePackService.getRangePacks(publisherEditionId!, subjectId!, grade!, semester!),
    enabled: publisherEditionId !== null && subjectId !== null && grade !== null && semester !== null,
  });

  // 處理出版社版本變更 - 保留已選範圍
  const handlePublisherEditionChange = (newPublisherEditionId: string) => {
    onChange({
      ...value,
      publisherEditionId: parseInt(newPublisherEditionId),
    });
  };

  // 處理年級學期變更 - 保留已選範圍
  const handleGradeSemesterChange = (selected: string) => {
    const option = GRADE_SEMESTER_OPTIONS.find(
      opt => `${opt.grade}-${opt.semester}` === selected
    );
    if (!option) return;

    onChange({
      ...value,
      grade: option.grade,
      semester: option.semester,
    });
  };

  // 處理範圍包選擇/取消選擇
  const handleRangePackToggle = (rangePack: RangePackOption, checked: boolean) => {
    let newRangePackIds: number[];
    const newMap = new Map(selectedRangePacksMap);

    if (checked) {
      // 加入選擇，但不超過上限
      if (rangePackIds.length >= MAX_SELECTION) {
        return; // 已達上限，不處理
      }
      newRangePackIds = [...rangePackIds, rangePack.id];
      newMap.set(rangePack.id, rangePack);
    } else {
      // 移除選擇
      newRangePackIds = rangePackIds.filter(id => id !== rangePack.id);
      newMap.delete(rangePack.id);
    }

    setSelectedRangePacksMap(newMap);
    onChange({
      ...value,
      rangePackIds: newRangePackIds,
    });
  };

  // 處理從 tag 移除範圍包
  const handleRemoveRangePack = (rangePackId: number) => {
    const newMap = new Map(selectedRangePacksMap);
    newMap.delete(rangePackId);
    setSelectedRangePacksMap(newMap);

    onChange({
      ...value,
      rangePackIds: rangePackIds.filter(id => id !== rangePackId),
    });
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* 已選範圍 Tags 區域 */}
        {rangePackIds.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                已選範圍
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {rangePackIds.length}/{MAX_SELECTION}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
              {Array.from(selectedRangePacksMap.values())
                .sort((a, b) => {
                  // 先按 grade 排序
                  if (a.grade !== b.grade) {
                    return (a.grade || 0) - (b.grade || 0);
                  }
                  // 再按 semester 排序
                  if (a.semester !== b.semester) {
                    return (a.semester || 0) - (b.semester || 0);
                  }
                  // 最後按 display_order 排序
                  return a.display_order - b.display_order;
                })
                .map((pack) => {
                  const gradeSemesterLabel = GRADE_SEMESTER_OPTIONS.find(
                    opt => opt.grade === pack.grade && opt.semester === pack.semester
                  )?.label || `${pack.grade}年級`;

                  return (
                    <Badge
                      key={pack.id}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      <span className="text-xs font-normal">
                        {gradeSemesterLabel} - {pack.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRangePack(pack.id)}
                        disabled={disabled}
                        className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
            </div>
          </div>
        )}

        {/* 出版社版本選擇器 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            出版社版本
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Select
            value={publisherEditionId?.toString() || ''}
            onValueChange={handlePublisherEditionChange}
            disabled={disabled || isLoadingPublisherEditions}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={isLoadingPublisherEditions ? '載入中...' : '選擇出版社版本'}
              />
            </SelectTrigger>
            <SelectContent>
              {publisherEditionsData?.data.map((edition) => (
                <SelectItem key={edition.id} value={edition.id.toString()}>
                  {edition.publisher_name} - {edition.version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoadingPublisherEditions && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>載入出版社版本中...</span>
            </div>
          )}
        </div>

        {/* 年級學期選擇器 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            年級學期
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Select
            value={grade !== null && semester !== null ? `${grade}-${semester}` : ''}
            onValueChange={handleGradeSemesterChange}
            disabled={disabled || !publisherEditionId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={publisherEditionId ? '選擇年級學期' : '請先選擇出版社版本'} />
            </SelectTrigger>
            <SelectContent>
              {GRADE_SEMESTER_OPTIONS.map((option) => (
                <SelectItem
                  key={`${option.grade}-${option.semester}`}
                  value={`${option.grade}-${option.semester}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 範圍包選擇器（多選） */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            瀏覽並選擇練習範圍
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {isLoadingRangePacks ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 p-4 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>載入範圍中...</span>
            </div>
          ) : !publisherEditionId ? (
            <div className="p-4 border rounded-md text-sm text-gray-500 dark:text-gray-400">
              請先選擇出版社版本
            </div>
          ) : !grade || !semester ? (
            <div className="p-4 border rounded-md text-sm text-gray-500 dark:text-gray-400">
              請選擇年級學期
            </div>
          ) : rangePacksData?.data.length === 0 ? (
            <div className="p-4 border rounded-md text-sm text-gray-500 dark:text-gray-400">
              此年級學期沒有可用的練習範圍
            </div>
          ) : (
            <div className="border rounded-md max-h-64 overflow-y-auto">
              <div className="divide-y">
                {rangePacksData?.data.map((pack) => {
                  const isSelected = rangePackIds.includes(pack.id);
                  const isMaxReached = rangePackIds.length >= MAX_SELECTION && !isSelected;
                  const hasDescription = pack.description && typeof pack.description === 'string' && pack.description.trim() !== '';

                  return (
                    <div
                      key={pack.id}
                      className={`flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        isMaxReached ? 'opacity-50' : ''
                      }`}
                    >
                      <Checkbox
                        id={`range-pack-${pack.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleRangePackToggle(pack, checked as boolean)
                        }
                        disabled={disabled || isMaxReached}
                      />
                      <label
                        htmlFor={`range-pack-${pack.id}`}
                        className={`flex-1 text-sm cursor-pointer ${
                          isMaxReached ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <div>{pack.name}</div>
                        {hasDescription ? (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {String(pack.description)}
                          </div>
                        ) : null}
                      </label>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {rangePackIds.length >= MAX_SELECTION && (
            <p className="text-xs text-orange-600 dark:text-orange-400">
              已達選擇上限（{MAX_SELECTION} 個）
            </p>
          )}
          {rangePackIds.length > 0 && rangePackIds.length < MIN_SELECTION && (
            <p className="text-xs text-red-600 dark:text-red-400">
              請至少選擇 {MIN_SELECTION} 個範圍
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
