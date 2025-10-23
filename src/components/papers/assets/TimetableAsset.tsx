'use client';

import { memo } from 'react';
import type { TimetableAssetData, MenuItemContent } from '@/types/paper';

interface TimetableAssetProps {
  asset: TimetableAssetData;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

function renderField(
  field: string | MenuItemContent | undefined,
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned'
): { content: string; translation?: string } | null {
  if (!field) return null;

  if (typeof field === 'string') {
    return { content: field };
  }

  if (typeof field === 'object' && 'content' in field && field.content) {
    return {
      content: field.content,
      translation: mode === 'completed' ? field.translation : undefined,
    };
  }

  return null;
}

export const TimetableAsset = memo(function TimetableAsset({ asset, mode }: TimetableAssetProps) {
  if (!asset?.schedule || asset.schedule.length === 0) return null;

  const title = renderField(asset.title, mode);
  const route = renderField(asset.route, mode);

  return (
    <div className="p-5 bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-950/30 dark:to-blue-950/30 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
      {/* Title */}
      {title && (
        <div className="mb-4 border-l-4 border-sky-500 pl-4">
          <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-100">
            {title.content}
          </h3>
          {title.translation && (
            <p className="text-base text-sky-600 dark:text-sky-400 mt-1">
              {title.translation}
            </p>
          )}
        </div>
      )}

      {/* Route Name */}
      {route && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg">🚂</span>
          <div>
            <span className="font-semibold text-sky-700 dark:text-sky-300">{route.content}</span>
            {route.translation && (
              <span className="block text-sm text-sky-600 dark:text-sky-400 mt-0.5">{route.translation}</span>
            )}
          </div>
        </div>
      )}

      {/* Schedule */}
      <div className="space-y-3">
        {asset.schedule.map((trip, idx) => (
          <div key={idx} className="bg-white/70 dark:bg-gray-800/70 p-4 rounded-lg border-l-4 border-sky-500">
            {/* Train Number */}
            <div className="font-bold text-sky-700 dark:text-sky-300 mb-3 flex items-center gap-2">
              <span className="bg-sky-500 text-white px-3 py-1 rounded text-sm">
                {trip.train_number}
              </span>
              {trip.platform && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Platform {trip.platform}
                </span>
              )}
            </div>

            {/* Departure and Arrival */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Departure</div>
                <div className="font-semibold text-sky-600 dark:text-sky-400">{trip.departure_time}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Arrival</div>
                <div className="font-semibold text-sky-600 dark:text-sky-400">{trip.arrival_time}</div>
              </div>
            </div>

            {/* Duration */}
            {trip.duration && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                <span>⏱️</span>
                <span>Duration: {trip.duration}</span>
              </div>
            )}

            {/* Stops */}
            {trip.stops && trip.stops.length > 0 && (
              <div className="mt-3 pt-3 border-t border-sky-100 dark:border-sky-900">
                <div className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-2">Stops</div>
                <div className="space-y-2">
                  {trip.stops.map((stop, stopIdx) => {
                    const station = renderField(stop.station, mode);
                    return (
                      <div key={stopIdx} className="flex items-center gap-3 ml-2">
                        <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                        {stop.arrival && (
                          <span className="text-sm font-medium text-sky-600 dark:text-sky-400 min-w-[80px]">
                            {stop.arrival}
                          </span>
                        )}
                        {station && (
                          <div className="flex-1">
                            <span className="text-gray-700 dark:text-gray-300">{station.content}</span>
                            {station.translation && (
                              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {station.translation}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
