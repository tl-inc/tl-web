import { Card } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { EngMcqText } from '@/components/items/EngMcqText';

interface SubItem {
  id: number;
  sequence: number;
  content_json: {
    stem: string;
    options: string[];
    answer_index: number;
    explanation: string;
  };
  answer: string;
}

interface EngListeningProps {
  sequence: number;
  asset: {
    audio: {
      url: string;
      text: string;
    };
    topic: string;
    word_count: number;
    document_type: string;
  };
  items?: SubItem[];
  userAnswers?: Map<number, number>;
  onAnswerChange?: (subItemId: number, answer: number | null) => void;
  showAnswer?: boolean;
}

export function EngListening({
  sequence,
  asset,
  items = [],
  userAnswers = new Map(),
  onAnswerChange,
  showAnswer = false
}: EngListeningProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
            題組 {sequence}
          </span>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
              <Volume2 className="h-4 w-4" />
              Listening
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="h-5 w-5 text-green-700 dark:text-green-300" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Topic: {asset.topic} | {asset.word_count} words
                </span>
              </div>
              <audio controls className="w-full" src={asset.audio.url}>
                Your browser does not support the audio element.
              </audio>
              {showAnswer && (
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                    Transcript:
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {asset.audio.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Sub-items */}
      {items.map((item, index) => (
        <EngMcqText
          key={item.id}
          sequence={sequence}
          subItemNumber={index + 1}
          content={item.content_json}
          userAnswer={userAnswers.get(item.id)}
          onAnswerChange={(answer) => onAnswerChange && onAnswerChange(item.id, answer)}
          showAnswer={showAnswer}
        />
      ))}
    </div>
  );
}
