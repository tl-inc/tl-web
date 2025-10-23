'use client';

import { memo } from 'react';
import type { MenuAssetData } from '@/types/paper';

interface MenuAssetProps {
  asset: MenuAssetData;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export const MenuAsset = memo(function MenuAsset({ asset, mode }: MenuAssetProps) {
  if (!asset?.menu) return null;

  return (
    <div className="p-5 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
      <h3 className="text-2xl font-bold text-center mb-5 text-amber-900 dark:text-amber-100">
        {typeof asset.restaurant_name === 'string' ? asset.restaurant_name : asset.restaurant_name?.content || ''}
      </h3>
      <div className="space-y-5">
        {/* Beverages */}
        {asset.menu.beverages && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded"></span>
              Beverages
            </h4>
            {asset.menu.beverages.map((item, idx: number) => (
              <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{typeof item.name === 'string' ? item.name : item.name?.content || ''}</span>
                    {mode === 'completed' && typeof item.name === 'object' && item.name?.translation && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{typeof item.price === 'string' ? item.price : item.price?.content || ''}</span>
                </div>
                {item.description && (
                  <div className="text-sm mt-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      {typeof item.description === 'string' ? item.description : item.description?.content || ''}
                    </p>
                    {mode === 'completed' && typeof item.description === 'object' && item.description?.translation && (
                      <p className="text-gray-500 dark:text-gray-500 mt-1">
                        {item.description.translation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Appetizers */}
        {asset.menu.appetizers && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded"></span>
              Appetizers
            </h4>
            {asset.menu.appetizers.map((item, idx: number) => (
              <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{typeof item.name === 'string' ? item.name : item.name?.content || ''}</span>
                    {mode === 'completed' && typeof item.name === 'object' && item.name?.translation && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{typeof item.price === 'string' ? item.price : item.price?.content || ''}</span>
                </div>
                {item.description && (
                  <div className="text-sm mt-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      {typeof item.description === 'string' ? item.description : item.description?.content || ''}
                    </p>
                    {mode === 'completed' && typeof item.description === 'object' && item.description?.translation && (
                      <p className="text-gray-500 dark:text-gray-500 mt-1">
                        {item.description.translation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main Courses */}
        {asset.menu.main_courses && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded"></span>
              Main Courses
            </h4>
            {asset.menu.main_courses.map((item, idx: number) => (
              <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{typeof item.name === 'string' ? item.name : item.name?.content || ''}</span>
                    {mode === 'completed' && typeof item.name === 'object' && item.name?.translation && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{typeof item.price === 'string' ? item.price : item.price?.content || ''}</span>
                </div>
                {item.description && (
                  <div className="text-sm mt-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      {typeof item.description === 'string' ? item.description : item.description?.content || ''}
                    </p>
                    {mode === 'completed' && typeof item.description === 'object' && item.description?.translation && (
                      <p className="text-gray-500 dark:text-gray-500 mt-1">
                        {item.description.translation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Desserts */}
        {asset.menu.desserts && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded"></span>
              Desserts
            </h4>
            {asset.menu.desserts.map((item, idx: number) => (
              <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{typeof item.name === 'string' ? item.name : item.name?.content || ''}</span>
                    {mode === 'completed' && typeof item.name === 'object' && item.name?.translation && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({item.name.translation})</span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{typeof item.price === 'string' ? item.price : item.price?.content || ''}</span>
                </div>
                {item.description && (
                  <div className="text-sm mt-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      {typeof item.description === 'string' ? item.description : item.description?.content || ''}
                    </p>
                    {mode === 'completed' && typeof item.description === 'object' && item.description?.translation && (
                      <p className="text-gray-500 dark:text-gray-500 mt-1">
                        {item.description.translation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Set Meals */}
        {asset.menu.set_meals && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded"></span>
              Set Meals
            </h4>
            {asset.menu.set_meals.map((meal, idx: number) => (
              <div key={idx} className="ml-4 mb-3 pb-3 border-b border-amber-100 dark:border-amber-900 last:border-0">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{typeof meal.name === 'string' ? meal.name : meal.name?.content || ''}</span>
                    {mode === 'completed' && typeof meal.name === 'object' && meal.name?.translation && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({meal.name.translation})</span>
                    )}
                  </div>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 ml-4">{typeof meal.price === 'string' ? meal.price : meal.price?.content || ''}</span>
                </div>
                {meal.items && (
                  <div className="mt-2 ml-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {meal.items && meal.items.map((subItem, itemIdx: number) => (
                        <div key={itemIdx}>
                          • {typeof subItem.name === 'string' ? subItem.name : subItem.name?.content || ''}
                          {mode === 'completed' && typeof subItem.name === 'object' && subItem.name?.translation && (
                            <span className="text-gray-500 dark:text-gray-500 ml-1">({subItem.name.translation})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Promotions */}
        {asset.menu.promotions && (
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-amber-400 dark:border-amber-600">
            <h4 className="font-semibold text-lg mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <span className="text-xl">🎉</span>
              Promotions
            </h4>
            {asset.menu.promotions.map((promo, idx: number) => (
              <div key={idx} className="ml-4 mb-2 last:mb-0">
                <p className="text-gray-700 dark:text-gray-300">
                  {typeof promo.description === 'string' ? promo.description : promo.description?.content || ''}
                </p>
                {mode === 'completed' && typeof promo.description === 'object' && promo.description?.translation && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {promo.description.translation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
