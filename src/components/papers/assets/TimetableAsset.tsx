'use client';

import { TimetableAssetData } from '@/types/paper';

interface TimetableAssetProps {
  asset: TimetableAssetData;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export function TimetableAsset({ asset, mode }: TimetableAssetProps) {
  if (!asset?.timetable) return null;

  const schedule = asset.timetable.schedule || [];
  const locations = asset.timetable.locations || [];
  const routeName = asset.timetable.route_name?.content || asset.timetable.route_name;

  return (
    <div className="p-5 bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-950/30 dark:to-blue-950/30 rounded-xl border border-sky-200/50 dark:border-sky-800/50">
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-100">
          {asset.title?.content || asset.title || 'Schedule'}
        </h3>
        {mode === 'completed' && asset.title?.translation && (
          <p className="text-base text-sky-600 dark:text-sky-400 mt-1">
            {asset.title.translation}
          </p>
        )}
      </div>
      {routeName && (
        <div className="text-sm mb-4 flex items-center gap-2">
          <span className="text-lg">🚌</span>
          <div>
            <span className="text-sky-600 dark:text-sky-400">{routeName}</span>
            {mode === 'completed' && asset.timetable.route_name?.translation && (
              <span className="block text-gray-500 dark:text-gray-400 text-xs mt-0.5">{asset.timetable.route_name.translation}</span>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {asset.timetable.notes && (
        <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-amber-500">
          <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-2">
            <span>⚠️</span>
            <span>Notes</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {asset.timetable.notes?.content || asset.timetable.notes}
          </p>
          {mode === 'completed' && asset.timetable.notes?.translation && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              {asset.timetable.notes.translation}
            </p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {schedule.map((trip, idx: number) => (
          <div key={idx} className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border-l-4 border-sky-500">
            <div className="font-bold text-sky-700 dark:text-sky-300 mb-2 flex items-center gap-2">
              <span className="bg-sky-500 text-white px-2 py-0.5 rounded text-sm">{trip.time}</span>
              {/* Price */}
              {trip.price && (
                <span className="ml-auto text-sm font-semibold text-sky-600 dark:text-sky-400">
                  💵 {trip.price?.content || trip.price}
                  {mode === 'completed' && trip.price?.translation && (
                    <span className="text-gray-500 dark:text-gray-400 ml-2">({trip.price.translation})</span>
                  )}
                </span>
              )}
            </div>

            {/* Duration */}
            {trip.duration && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                <span>⏱️</span>
                <span>{trip.duration?.content || trip.duration}</span>
                {mode === 'completed' && trip.duration?.translation && (
                  <span className="text-gray-500 dark:text-gray-400">({trip.duration.translation})</span>
                )}
              </div>
            )}

            {trip.stops && trip.stops.map((stop, stopIdx: number) => {
              const location = locations[stop.location_index];
              return (
                <div key={stopIdx} className="flex items-center gap-3 ml-2 mb-2 last:mb-0">
                  <div className="w-2 h-2 rounded-full bg-sky-400"></div>
                  <span className="text-sm font-medium text-sky-600 dark:text-sky-400 min-w-[80px]">{stop.arrival_time}</span>
                  <div className="flex-1">
                    <span className="text-gray-700 dark:text-gray-300">{location?.name?.content || location?.name}</span>
                    {mode === 'completed' && location?.name?.translation && (
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{location.name.translation}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Transfer Information */}
      {asset.timetable.transfer_info && (
        <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-sky-500">
          <div className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1 flex items-center gap-2">
            <span>🔄</span>
            <span>Transfer Information</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {asset.timetable.transfer_info?.content || asset.timetable.transfer_info}
          </p>
          {mode === 'completed' && asset.timetable.transfer_info?.translation && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              {asset.timetable.transfer_info.translation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
