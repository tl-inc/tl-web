import { Card } from '@/components/ui/card';

interface EngInfoReadingScheduleProps {
  sequence: number;
  asset: {
    title: string;
    header_notes: string;
    footer_notes: string;
    entries: Array<{
      time: string;
      event: string;
    }>;
    document_type: string;
    schedule_type: string;
  };
}

export function EngInfoReadingSchedule({ sequence, asset }: EngInfoReadingScheduleProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          題組 {sequence}
        </span>
        <div className="flex-1 space-y-4">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Schedule
          </div>
          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4">
              {asset.title}
            </h3>
            {asset.header_notes && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 p-3 bg-white dark:bg-gray-800 rounded">
                {asset.header_notes}
              </p>
            )}
            <div className="space-y-2">
              {asset.entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-white dark:bg-gray-800 rounded border border-purple-200 dark:border-purple-700"
                >
                  <span className="text-sm font-mono text-purple-700 dark:text-purple-300 shrink-0">
                    {entry.time}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {entry.event}
                  </span>
                </div>
              ))}
            </div>
            {asset.footer_notes && (
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 p-3 bg-white dark:bg-gray-800 rounded">
                {asset.footer_notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
