/**
 * EmptyState Component
 *
 * 統一的空狀態提示元件
 */

import type { ReactNode } from 'react';

interface EmptyStateProps {
  /**
   * 主要訊息（標題）
   */
  message: string;
  /**
   * 次要訊息（描述）
   */
  description?: string;
  /**
   * 操作按鈕或其他元素
   */
  action?: ReactNode;
  /**
   * 垂直內距大小
   * @default "default"
   */
  spacing?: 'compact' | 'default' | 'large';
  /**
   * 文字大小
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * 自訂 className
   */
  className?: string;
}

const spacingClasses = {
  compact: 'py-8',
  default: 'py-12',
  large: 'py-20',
};

const messageSizeClasses = {
  sm: 'text-base',
  default: 'text-lg',
  lg: 'text-2xl font-bold',
};

const descriptionSizeClasses = {
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
};

export function EmptyState({
  message,
  description,
  action,
  spacing = 'default',
  size = 'default',
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center ${spacingClasses[spacing]} ${className}`}>
      <p className={`text-gray-600 dark:text-gray-400 ${messageSizeClasses[size]} ${description ? 'mb-2' : ''}`}>
        {message}
      </p>
      {description && (
        <p className={`text-gray-500 dark:text-gray-500 ${descriptionSizeClasses[size]} ${action ? 'mb-6' : ''}`}>
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
