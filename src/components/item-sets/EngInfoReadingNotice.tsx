import { Card } from '@/components/ui/card';

interface EngInfoReadingNoticeProps {
  sequence: number;
  asset: {
    title: string;
    date: string;
    content: string;
    location: string;
    contact: string;
    notes: string[];
    document_type: string;
  };
}

export function EngInfoReadingNotice({ sequence, asset }: EngInfoReadingNoticeProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          題組 {sequence}
        </span>
        <div className="flex-1 space-y-4">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Notice
          </div>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">
              {asset.title}
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              <div>{asset.date}</div>
              <div>{asset.location}</div>
            </div>
            <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100 mb-4">
              {asset.content}
            </p>
            {asset.notes.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Important Notes:
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 dark:text-gray-200">
                  {asset.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-sm text-blue-700 dark:text-blue-300 mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
              {asset.contact}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
