import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EngClozeProps {
  sequence: number;
  content: {
    passage: string;
    options: string[];
    answers: Array<{
      blank_number: number;
      answer_index: number;
      explanation: string;
    }>;
  };
  userAnswers?: Map<number, number>;
  onAnswerChange?: (blankNumber: number, answerIndex: number | null) => void;
  showAnswer?: boolean;
}

export function EngCloze({
  sequence,
  content,
  userAnswers = new Map(),
  onAnswerChange,
  showAnswer = false
}: EngClozeProps) {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Split passage into parts for rendering with interactive blanks
  const renderPassageWithBlanks = () => {
    const parts: JSX.Element[] = [];
    let remainingText = content.passage;
    let partIndex = 0;

    // Sort answers by blank_number to process in order
    const sortedAnswers = [...content.answers].sort((a, b) => a.blank_number - b.blank_number);

    sortedAnswers.forEach((answer) => {
      const placeholder = `{{blank_${answer.blank_number}}}`;
      const index = remainingText.indexOf(placeholder);

      if (index !== -1) {
        // Add text before blank
        if (index > 0) {
          parts.push(
            <span key={`text-${partIndex}`}>
              {remainingText.substring(0, index)}
            </span>
          );
        }

        // Add blank/select
        const userAnswer = userAnswers.get(answer.blank_number);
        const correctAnswer = content.answers.find(a => a.blank_number === answer.blank_number);
        const isCorrect = userAnswer === correctAnswer?.answer_index;

        if (showAnswer) {
          // Show answer with color coding
          const selectedText = userAnswer !== undefined ? content.options[userAnswer] : '';
          const correctText = correctAnswer ? content.options[correctAnswer.answer_index] : '';

          parts.push(
            <span key={`blank-${answer.blank_number}`} className="inline-flex items-center gap-1">
              <span className={`font-semibold px-2 py-1 rounded ${
                isCorrect
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}>
                {selectedText || '(未作答)'}
              </span>
              {!isCorrect && (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  → {correctText}
                </span>
              )}
            </span>
          );
        } else {
          // Show select dropdown
          parts.push(
            <span key={`blank-${answer.blank_number}`} className="inline-block align-baseline mx-0.5 my-1">
              <Select
                value={userAnswer !== undefined ? userAnswer.toString() : undefined}
                onValueChange={(value) => onAnswerChange && onAnswerChange(answer.blank_number, parseInt(value))}
              >
                <SelectTrigger className="w-[180px] h-7 text-sm inline-flex items-center py-0">
                  <SelectValue placeholder={`(${answer.blank_number})`} />
                </SelectTrigger>
                <SelectContent>
                  {content.options.map((option, idx) => (
                    <SelectItem key={idx} value={idx.toString()}>
                      ({optionLabels[idx]}) {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          );
        }

        remainingText = remainingText.substring(index + placeholder.length);
        partIndex++;
      }
    });

    // Add remaining text
    if (remainingText) {
      parts.push(<span key={`text-${partIndex}`}>{remainingText}</span>);
    }

    return parts;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          {sequence}.
        </span>
        <div className="flex-1 space-y-4">
          <div className="text-base leading-loose text-gray-900 dark:text-gray-100">
            {renderPassageWithBlanks()}
          </div>
          {/* Show unanswered blanks warning */}
          {showAnswer && (() => {
            const unansweredBlanks = content.answers
              .filter(answer => !userAnswers.has(answer.blank_number))
              .map(answer => answer.blank_number);

            if (unansweredBlanks.length > 0) {
              return (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="text-yellow-800 dark:text-yellow-200 text-sm font-semibold">
                    ⚠️ 未作答空格：({unansweredBlanks.join(', ')})
                  </span>
                </div>
              );
            }
            return null;
          })()}
          {showAnswer && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="font-semibold text-blue-700 dark:text-blue-300">解答說明：</div>
              {content.answers.map((answer) => (
                <div key={answer.blank_number} className="text-sm">
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    ({answer.blank_number}) ({optionLabels[answer.answer_index]}) {content.options[answer.answer_index]}
                  </span>
                  <p className="text-blue-800 dark:text-blue-200 mt-1 ml-4">
                    {answer.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
