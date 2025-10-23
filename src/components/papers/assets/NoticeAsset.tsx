'use client';

import { memo } from 'react';
import type { NoticeAssetData, MenuItemContent } from '@/types/paper';

interface NoticeAssetProps {
  asset: NoticeAssetData;
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

export const NoticeAsset = memo(function NoticeAsset({ asset, mode }: NoticeAssetProps) {
  if (!asset) return null;

  const title = renderField(asset.title, mode);
  const content = renderField(asset.content, mode);
  const date = renderField(asset.date, mode);
  const location = renderField(asset.location, mode);
  const organizer = renderField(asset.organizer, mode);

  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
      {/* Title */}
      {title && (
        <div className="border-l-4 border-indigo-500 pl-4 mb-4">
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {title.content}
          </h3>
          {title.translation && (
            <p className="text-base text-indigo-600 dark:text-indigo-400 mt-1">
              {title.translation}
            </p>
          )}
        </div>
      )}

      <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
        {/* Date */}
        {date && (
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📅 Date:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{date.content}</span>
              {date.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{date.translation}</span>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📍 Location:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{location.content}</span>
              {location.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{location.translation}</span>
              )}
            </div>
          </div>
        )}

        {/* Organizer */}
        {organizer && (
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">👥 Organizer:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{organizer.content}</span>
              {organizer.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{organizer.translation}</span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {content && (
          <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {content.content}
            </p>
            {content.translation && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap leading-relaxed">
                {content.translation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
