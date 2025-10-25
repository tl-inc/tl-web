/**
 * ExerciseTypeSelector Component
 * 題型選擇器組件 - 提供多選題型功能
 */
'use client';

import type { ExerciseTypeSelectorProps, ExerciseTypeOption } from './types';

// 預設題型選項（基礎題型）
const DEFAULT_EXERCISE_TYPES: ExerciseTypeOption[] = [
  { id: 1, name: 'vocabulary', display_name: '字彙' },
  { id: 2, name: 'phrase', display_name: '片語' },
  { id: 3, name: 'grammar', display_name: '文法' },
];

/**
 * 題型選擇器組件
 *
 * 特性：
 * - 受控組件模式
 * - 支援多選（checkbox）
 * - 可設定最少/最多選擇數量
 * - 自定義題型選項
 *
 * @example
 * ```tsx
 * const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
 *
 * <ExerciseTypeSelector
 *   value={selectedTypes}
 *   onChange={setSelectedTypes}
 *   required
 *   minSelection={1}
 * />
 * ```
 */
export function ExerciseTypeSelector({
  value,
  onChange,
  options = DEFAULT_EXERCISE_TYPES,
  required = false,
  minSelection = 1,
  maxSelection,
  disabled = false,
  className,
  helperText,
}: ExerciseTypeSelectorProps) {
  // 處理題型選擇切換
  const handleToggle = (typeId: number) => {
    const isSelected = value.includes(typeId);

    if (isSelected) {
      // 取消選擇
      onChange(value.filter((id) => id !== typeId));
    } else {
      // 新增選擇（檢查最大數量限制）
      if (maxSelection && value.length >= maxSelection) {
        return; // 已達最大選擇數量
      }
      onChange([...value, typeId]);
    }
  };

  // 檢查是否可以取消選擇（需滿足最少選擇數量）
  const canDeselect = (typeId: number) => {
    if (!value.includes(typeId)) return true;
    return value.length > minSelection;
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        {/* 標籤 */}
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          選擇題型
          {required && <span className="text-red-500 ml-1">*</span>}
          {minSelection > 0 && (
            <span className="text-sm text-muted-foreground ml-2">
              (至少選 {minSelection} 種)
            </span>
          )}
        </label>

        {/* 題型選項列表 */}
        <div className="space-y-2">
          {options.map((type) => {
            const isSelected = value.includes(type.id);
            const isDisabled =
              disabled ||
              (!isSelected && maxSelection !== undefined && value.length >= maxSelection);

            return (
              <label
                key={type.id}
                className={`
                  flex items-center gap-2 p-3 border rounded-lg cursor-pointer
                  transition-colors
                  ${isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-muted'
                  }
                  ${isSelected ? 'bg-muted border-primary' : ''}
                `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggle(type.id)}
                  disabled={isDisabled || (isSelected && !canDeselect(type.id))}
                  className="w-4 h-4"
                />
                <span className="flex-1">{type.display_name}</span>
              </label>
            );
          })}
        </div>

        {/* 輔助訊息 */}
        {helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    </div>
  );
}
