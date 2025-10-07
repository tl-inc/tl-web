import { Card } from '@/components/ui/card';

interface EngMcqTextProps {
  sequence: number;
  content: {
    stem: string;
    options: string[];
    answer_index: number;
    explanation: string;
    explanations?: {
      why_correct: string;
      why_incorrect: string[];
    };
  };
  userAnswer?: number | null;
  onAnswerChange?: (answer: number | null) => void;
  showAnswer?: boolean;
  subItemNumber?: number;
}

export function EngMcqText({
  sequence,
  content,
  userAnswer,
  onAnswerChange,
  showAnswer = false,
  subItemNumber
}: EngMcqTextProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  const isCorrect = userAnswer === content.answer_index;
  const displaySequence = subItemNumber ? `${sequence}-${subItemNumber}` : sequence;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          {displaySequence}.
        </span>
        <div className="flex-1 space-y-4">
          <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
            {content.stem}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {content.options.map((option, index) => {
              const isSelected = userAnswer === index;
              const isAnswerKey = index === content.answer_index;
              const hasAnswered = userAnswer !== undefined && userAnswer !== null;

              let borderColor = 'border-gray-200 dark:border-gray-700';
              let bgColor = 'bg-white dark:bg-gray-800';

              if (showAnswer) {
                if (isAnswerKey) {
                  // Always show correct answer in green
                  borderColor = 'border-green-500';
                  bgColor = 'bg-green-50 dark:bg-green-900/20';
                } else if (isSelected) {
                  // User selected wrong answer - show in red
                  borderColor = 'border-red-500';
                  bgColor = 'bg-red-50 dark:bg-red-900/20';
                } else if (!hasAnswered && !isAnswerKey) {
                  // Not answered - keep neutral but slightly dimmed
                  bgColor = 'bg-gray-100 dark:bg-gray-800/50';
                }
              } else if (isSelected) {
                borderColor = 'border-blue-500';
                bgColor = 'bg-blue-50 dark:bg-blue-900/20';
              }

              return (
                <button
                  key={index}
                  onClick={() => onAnswerChange && onAnswerChange(isSelected ? null : index)}
                  disabled={showAnswer}
                  className={`p-3 rounded-lg border-2 transition-colors text-left cursor-pointer disabled:cursor-default ${borderColor} ${bgColor} hover:border-blue-400 disabled:hover:border-current`}
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">
                    ({optionLabels[index]})
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">{option}</span>
                  {showAnswer && isAnswerKey && (
                    <span className="ml-2 text-green-600 dark:text-green-400 font-bold">✓</span>
                  )}
                  {showAnswer && isSelected && !isCorrect && (
                    <span className="ml-2 text-red-600 dark:text-red-400 font-bold">✗</span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Show unanswered warning when showing answers */}
          {showAnswer && userAnswer === undefined && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <span className="text-yellow-800 dark:text-yellow-200 text-sm font-semibold">
                ⚠️ 未作答
              </span>
            </div>
          )}
          {showAnswer && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <span className="text-blue-700 dark:text-blue-300 font-semibold shrink-0">
                  解答：
                </span>
                <div className="space-y-2">
                  <p className="text-blue-900 dark:text-blue-100">
                    正確答案：({optionLabels[content.answer_index]}) {content.options[content.answer_index]}
                  </p>
                  <p className="text-blue-800 dark:text-blue-200">{content.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
