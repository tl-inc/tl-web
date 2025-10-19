/**
 * ExerciseSessionStats 元件
 *
 * 顯示 Session 統計資訊
 */
import { memo } from 'react';
import { Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SessionStats } from '@/types/exerciseSession';

interface ExerciseSessionStatsProps {
  stats: SessionStats;
  className?: string;
}

export const ExerciseSessionStats = memo(function ExerciseSessionStats({
  stats,
  className,
}: ExerciseSessionStatsProps) {
  const accuracyPercent = Math.round(stats.accuracy * 100);

  return (
    <Card className={cn('border-none shadow-none', className)}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* 已答題數 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.total_questions}
            </div>
            <div className="text-xs text-muted-foreground">已答題數</div>
          </div>

          {/* 正確率 */}
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {accuracyPercent}%
            </div>
            <div className="text-xs text-muted-foreground">正確率</div>
          </div>

          {/* 連勝數 */}
          {stats.current_streak > 0 && (
            <div className="col-span-2 flex items-center justify-center gap-2 mt-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-lg font-bold text-orange-500">
                連勝 {stats.current_streak} 題
              </span>
            </div>
          )}

          {/* 最高連勝 */}
          {stats.max_streak > 0 && (
            <div className="col-span-2 text-center text-sm text-muted-foreground">
              最高連勝: {stats.max_streak} 題
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
