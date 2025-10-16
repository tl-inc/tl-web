import type { ReactNode } from 'react';
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

interface ItemSetWithSubItemsProps {
  sequence: number;
  assetComponent: ReactNode;
  items?: SubItem[];
  userAnswers?: Map<number, number>;
  onAnswerChange?: (subItemId: number, answer: number | null) => void;
  showAnswer?: boolean;
}

export function ItemSetWithSubItems({
  sequence,
  assetComponent,
  items = [],
  userAnswers = new Map(),
  onAnswerChange,
  showAnswer = false
}: ItemSetWithSubItemsProps) {
  return (
    <div className="space-y-6">
      {assetComponent}

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
