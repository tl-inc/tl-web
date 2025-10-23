/**
 * UnansweredBadge Component
 *
 * 統一的未作答標記元件
 */

interface UnansweredBadgeProps {
  /**
   * 標記文字
   * @default "⚠️ 未作答"
   */
  label?: string;
  /**
   * 大小
   * @default "default"
   */
  size?: 'sm' | 'default';
  /**
   * 自訂 className
   */
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-1',
  default: 'px-3 py-1',
};

export function UnansweredBadge({
  label = '⚠️ 未作答',
  size = 'default',
  className = '',
}: UnansweredBadgeProps) {
  return (
    <span
      className={`
        ${sizeClasses[size]}
        text-xs font-semibold
        bg-amber-100 dark:bg-amber-900/40
        text-amber-700 dark:text-amber-300
        rounded-full
        border border-amber-300 dark:border-amber-700
        whitespace-nowrap
        ${className}
      `}
    >
      {label}
    </span>
  );
}
