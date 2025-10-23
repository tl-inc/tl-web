/**
 * AnswerFeedback Component
 *
 * 統一的答案反饋元件，用於顯示正確/錯誤答案的說明
 */

interface AnswerFeedbackProps {
  /**
   * 反饋類型
   */
  type: 'correct' | 'incorrect';
  /**
   * 反饋訊息
   */
  message: string;
  /**
   * 顯示變體
   * - selected: 使用者選中的答案（錯誤時顯示紅色）
   * - info: 資訊性提示（未選中或未作答時顯示灰色）
   * @default 'selected'
   */
  variant?: 'selected' | 'info';
  /**
   * 文字大小
   * @default 'default'
   */
  size?: 'sm' | 'default';
  /**
   * 外層容器間距
   * @default 'default'
   */
  spacing?: 'compact' | 'default';
  /**
   * 自訂 className
   */
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs',
  default: 'text-sm',
};

const spacingClasses = {
  compact: 'mt-2 ml-3 p-2',
  default: 'mt-2 ml-4 p-3',
};

const iconMap = {
  correct: '✓',
  incorrect: '✗',
  info: 'ℹ️',
};

export function AnswerFeedback({
  type,
  message,
  variant = 'selected',
  size = 'default',
  spacing = 'default',
  className = '',
}: AnswerFeedbackProps) {
  // 決定顏色樣式
  let colorClass = '';
  let icon = '';

  if (type === 'correct') {
    colorClass = 'text-green-700 dark:text-green-300';
    icon = iconMap.correct;
  } else if (type === 'incorrect') {
    if (variant === 'selected') {
      colorClass = 'text-red-700 dark:text-red-300';
      icon = iconMap.incorrect;
    } else {
      colorClass = 'text-gray-600 dark:text-gray-400';
      icon = iconMap.info;
    }
  }

  return (
    <div
      className={`
        ${spacingClasses[spacing]}
        bg-gray-50/80 dark:bg-gray-900/80
        rounded
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <div className={colorClass}>
        <span className="font-semibold">{icon} </span>
        {message}
      </div>
    </div>
  );
}
