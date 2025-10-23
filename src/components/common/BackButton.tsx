/**
 * BackButton Component
 *
 * 統一的返回按鈕元件
 */

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  /**
   * 按鈕點擊處理函數
   */
  onClick: () => void;
  /**
   * 按鈕文字
   * @default "返回"
   */
  label?: string;
  /**
   * 按鈕大小
   * @default "default"
   */
  size?: 'default' | 'sm' | 'lg';
  /**
   * 是否在小螢幕隱藏文字 (僅顯示圖示)
   * @default false
   */
  hideTextOnSmall?: boolean;
  /**
   * 自訂 className
   */
  className?: string;
}

export function BackButton({
  onClick,
  label = '返回',
  size = 'default',
  hideTextOnSmall = false,
  className = 'mb-6',
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onClick}
      className={`flex items-center gap-1 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {hideTextOnSmall ? (
        <span className="hidden sm:inline">{label}</span>
      ) : (
        <span>{label}</span>
      )}
    </Button>
  );
}
