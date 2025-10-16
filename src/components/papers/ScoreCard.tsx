import { CheckCircle, XCircle, Target, TrendingUp } from 'lucide-react';

interface ScoreCardProps {
  score: number; // 0-100
  correctCount: number;
  totalCount: number;
}

export function ScoreCard({ score, correctCount, totalCount }: ScoreCardProps) {
  // 計算答錯數
  const incorrectCount = totalCount - correctCount;

  // 根據分數決定顏色主題
  const getScoreTheme = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30',
        border: 'border-green-200/50 dark:border-green-700/50',
        text: 'text-green-700 dark:text-green-300',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        icon: 'text-green-600 dark:text-green-400',
      };
    } else if (score >= 70) {
      return {
        bg: 'from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30',
        border: 'border-blue-200/50 dark:border-blue-700/50',
        text: 'text-blue-700 dark:text-blue-300',
        iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        icon: 'text-blue-600 dark:text-blue-400',
      };
    } else if (score >= 60) {
      return {
        bg: 'from-yellow-50/80 to-amber-50/80 dark:from-yellow-950/30 dark:to-amber-950/30',
        border: 'border-yellow-200/50 dark:border-yellow-700/50',
        text: 'text-yellow-700 dark:text-yellow-300',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        icon: 'text-yellow-600 dark:text-yellow-400',
      };
    } else {
      return {
        bg: 'from-red-50/80 to-pink-50/80 dark:from-red-950/30 dark:to-pink-950/30',
        border: 'border-red-200/50 dark:border-red-700/50',
        text: 'text-red-700 dark:text-red-300',
        iconBg: 'bg-red-100 dark:bg-red-900/50',
        icon: 'text-red-600 dark:text-red-400',
      };
    }
  };

  const theme = getScoreTheme(score);

  // 等級文字
  const getScoreLabel = (score: number) => {
    if (score >= 90) return '優異';
    if (score >= 70) return '良好';
    if (score >= 60) return '及格';
    return '待加強';
  };

  return (
    <div className={`rounded-xl border shadow-md p-8 bg-gradient-to-br ${theme.bg} ${theme.border}`}>
      <div className="flex items-center justify-between">
        {/* 左側：總分 */}
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-2xl ${theme.iconBg}`}>
            <Target className={`w-12 h-12 ${theme.icon}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">總分</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${theme.text}`}>{score}</span>
              <span className="text-2xl font-semibold text-gray-500 dark:text-gray-400">分</span>
            </div>
            <p className={`text-sm font-semibold mt-1 ${theme.text}`}>{getScoreLabel(score)}</p>
          </div>
        </div>

        {/* 右側：答題統計 */}
        <div className="flex gap-8">
          {/* 答對數 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">答對</p>
          </div>

          {/* 答錯數 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{incorrectCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">答錯</p>
          </div>

          {/* 總題數 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalCount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">總題數</p>
          </div>
        </div>
      </div>
    </div>
  );
}
