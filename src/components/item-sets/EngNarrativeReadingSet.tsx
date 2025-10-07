import { Card } from '@/components/ui/card';

interface EngNarrativeReadingSetProps {
  sequence: number;
  asset: {
    passage: string;
    audio?: { url: string; text: string } | null;
    image?: { url: string; description: string } | null;
  };
}

export function EngNarrativeReadingSet({ sequence, asset }: EngNarrativeReadingSetProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          題組 {sequence}
        </span>
        <div className="flex-1 space-y-4">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Reading Passage
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {asset.passage}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
