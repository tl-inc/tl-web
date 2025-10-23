/**
 * PageLoading Component
 *
 * 統一的頁面載入狀態顯示元件
 */

import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  /**
   * 載入訊息文字
   * @default "載入中..."
   */
  message?: string;
  /**
   * 是否使用全螢幕高度
   * @default true
   */
  fullScreen?: boolean;
  /**
   * Spinner 大小
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * 是否顯示文字訊息
   * @default true
   */
  showMessage?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  default: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function PageLoading({
  message = '載入中...',
  fullScreen = true,
  size = 'default',
  showMessage = true,
}: PageLoadingProps) {
  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center'
    : 'flex items-center justify-center h-96';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <Loader2
          className={`${sizeClasses[size]} animate-spin mx-auto text-blue-600 dark:text-blue-400 ${
            showMessage ? 'mb-4' : ''
          }`}
        />
        {showMessage && (
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
}
