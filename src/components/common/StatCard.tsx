/**
 * StatCard Component
 *
 * 統一的統計數值顯示元件
 */

import type { ReactNode } from 'react';

interface StatCardProps {
  /**
   * 數值
   */
  value: string | number;
  /**
   * 標籤
   */
  label: string;
  /**
   * 圖示元素
   */
  icon?: ReactNode;
  /**
   * 數值顏色
   * @default "default"
   */
  valueColor?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * 數值大小
   * @default "default"
   */
  valueSize?: 'sm' | 'default' | 'lg';
  /**
   * 自訂 className
   */
  className?: string;
}

const valueColorClasses = {
  default: 'text-gray-900 dark:text-gray-100',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-orange-500 dark:text-orange-400',
  danger: 'text-red-600 dark:text-red-400',
};

const valueSizeClasses = {
  sm: 'text-xl',
  default: 'text-2xl',
  lg: 'text-3xl',
};

export function StatCard({
  value,
  label,
  icon,
  valueColor = 'default',
  valueSize = 'default',
  className = '',
}: StatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      {icon && <div className="mb-2 flex justify-center">{icon}</div>}
      <div className={`${valueSizeClasses[valueSize]} font-bold ${valueColorClasses[valueColor]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {label}
      </div>
    </div>
  );
}
