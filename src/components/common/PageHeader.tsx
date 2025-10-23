/**
 * PageHeader Component
 *
 * 統一的頁面標題元件
 */

import type { ReactNode } from 'react';

interface PageHeaderProps {
  /**
   * 頁面標題
   */
  title: string;
  /**
   * 副標題或描述
   */
  description?: string;
  /**
   * 圖示元素
   */
  icon?: ReactNode;
  /**
   * 文字對齊方式
   * @default "left"
   */
  align?: 'left' | 'center';
  /**
   * 標題文字大小
   * @default "default"
   */
  size?: 'default' | 'large';
  /**
   * 自訂 className (例如調整間距)
   */
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  align = 'left',
  size = 'default',
  className = 'mb-8',
}: PageHeaderProps) {
  const titleSizeClass =
    size === 'large'
      ? 'text-4xl font-bold'
      : 'text-3xl md:text-4xl font-bold';

  const alignClass = align === 'center' ? 'text-center' : '';

  // 如果有圖示且是居中,使用特殊佈局
  if (icon && align === 'center') {
    return (
      <div className={className}>
        <div className="flex items-center justify-center gap-2">
          {icon}
          <h1 className={`${titleSizeClass}`}>{title}</h1>
        </div>
        {description && (
          <p className={`text-gray-600 dark:text-gray-400 mt-2 ${alignClass}`}>
            {description}
          </p>
        )}
      </div>
    );
  }

  // 標準佈局
  return (
    <div className={className}>
      <h1
        className={`${titleSizeClass} text-gray-900 dark:text-gray-100 ${description ? 'mb-2' : ''} ${alignClass}`}
      >
        {title}
      </h1>
      {description && (
        <p className={`text-gray-600 dark:text-gray-400 ${alignClass}`}>{description}</p>
      )}
    </div>
  );
}
