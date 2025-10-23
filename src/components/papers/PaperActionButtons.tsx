/**
 * PaperActionButtons Component
 * 
 * 試卷頁面的操作按鈕組（開始、完成、放棄、重新作答）
 */

import { Loader2, Play, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaperActionButtonsProps {
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  isSubmitting: boolean;
  onStart: () => void;
  onComplete: () => void;
  onAbandon: () => void;
  onRenew: () => void;
}

export function PaperActionButtons({
  mode,
  isSubmitting,
  onStart,
  onComplete,
  onAbandon,
  onRenew,
}: PaperActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Pending 狀態：顯示開始按鈕 */}
      {mode === 'pending' && (
        <Button
          onClick={onStart}
          disabled={isSubmitting}
          className="flex-1 min-w-[120px] sm:flex-initial bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>開始作答</span>
        </Button>
      )}

      {/* In Progress 狀態：顯示完成和放棄按鈕 */}
      {mode === 'in_progress' && (
        <>
          <Button
            onClick={onComplete}
            disabled={isSubmitting}
            className="flex-1 min-w-[120px] sm:flex-initial bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>完成作答</span>
          </Button>
          <Button
            onClick={onAbandon}
            disabled={isSubmitting}
            variant="destructive"
            className="flex-1 min-w-[120px] sm:flex-initial"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            <span>放棄作答</span>
          </Button>
        </>
      )}

      {/* Completed 或 Abandoned 狀態：顯示重新作答按鈕 */}
      {(mode === 'completed' || mode === 'abandoned') && (
        <Button
          onClick={onRenew}
          disabled={isSubmitting}
          className="flex-1 min-w-[120px] sm:flex-initial bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          <span>重新作答</span>
        </Button>
      )}
    </div>
  );
}
