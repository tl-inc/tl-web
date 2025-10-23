/**
 * LoadingButton Component
 *
 * 統一的載入狀態按鈕元件
 */

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingButtonProps {
  /**
   * 是否處於載入狀態
   */
  isLoading: boolean;
  /**
   * 載入時顯示的文字
   */
  loadingText?: string;
  /**
   * 正常狀態顯示的內容
   */
  children: ReactNode;
  /**
   * 是否顯示 Loader2 spinner 圖示
   * @default true
   */
  showSpinner?: boolean;
  /**
   * 點擊處理函數
   */
  onClick?: () => void;
  /**
   * 是否禁用（額外的禁用條件）
   * @default false
   */
  disabled?: boolean;
  /**
   * 按鈕類型
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * 按鈕變體
   */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /**
   * 按鈕大小
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /**
   * 自訂 className
   */
  className?: string;
}

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  showSpinner = true,
  onClick,
  disabled = false,
  type = 'button',
  variant,
  size,
  className,
}: LoadingButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          {showSpinner && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
