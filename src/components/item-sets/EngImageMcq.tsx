import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface EngImageMcqProps {
  sequence: number;
  asset: {
    image: {
      url: string;
      prompt: string;
      description: string;
    };
    scene_type: string;
    document_type: string;
  };
}

export function EngImageMcq({ sequence, asset }: EngImageMcqProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          題組 {sequence}
        </span>
        <div className="flex-1 space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            場景類型：{asset.scene_type}
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={asset.image.url}
              alt={asset.image.description}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            {asset.image.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
