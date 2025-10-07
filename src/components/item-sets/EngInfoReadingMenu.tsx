import { Card } from '@/components/ui/card';

interface EngInfoReadingMenuProps {
  sequence: number;
  asset: {
    title: string;
    footer: string;
    categories: Array<{
      name: string;
      items: Array<{
        name: string;
        price: string;
      }>;
    }>;
    document_type: string;
  };
}

export function EngInfoReadingMenu({ sequence, asset }: EngInfoReadingMenuProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold text-gray-700 dark:text-gray-300 shrink-0">
          題組 {sequence}
        </span>
        <div className="flex-1 space-y-4">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase">
            Menu
          </div>
          <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
            <h3 className="text-2xl font-bold text-center text-amber-900 dark:text-amber-100 mb-6">
              {asset.title}
            </h3>
            <div className="space-y-6">
              {asset.categories.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 border-b-2 border-amber-300 dark:border-amber-700 pb-1">
                    {category.name}
                  </h4>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex justify-between items-baseline gap-4"
                      >
                        <span className="text-gray-900 dark:text-gray-100">{item.name}</span>
                        <span className="text-amber-700 dark:text-amber-300 font-semibold shrink-0">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-amber-300 dark:border-amber-700 text-sm text-gray-700 dark:text-gray-300 text-center">
              {asset.footer}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
