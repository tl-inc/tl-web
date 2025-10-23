'use client';

import { memo } from 'react';
import type { AdvertisementAssetData, MenuItemContent } from '@/types/paper';

interface AdvertisementAssetProps {
  asset: AdvertisementAssetData;
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

export const AdvertisementAsset = memo(function AdvertisementAsset({ asset, mode }: AdvertisementAssetProps) {
  if (!asset) return null;

  const title = renderField(asset.title, mode);
  const company = renderField(asset.company, mode);
  const content = renderField(asset.content, mode);
  const contact = renderField(asset.contact, mode);

  return (
    <div className="p-5 bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/50">
      <div className="text-center mb-4">
        {/* Title */}
        {title && (
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100">
              {title.content}
            </h3>
            {title.translation && (
              <p className="text-base text-rose-600 dark:text-rose-400 mt-1">
                {title.translation}
              </p>
            )}
          </div>
        )}

        {/* Company */}
        {company && (
          <div className="mb-3">
            <p className="text-lg font-semibold text-rose-700 dark:text-rose-300 italic">
              {company.content}
            </p>
            {company.translation && (
              <p className="text-sm text-rose-500 dark:text-rose-400 mt-1 italic">
                {company.translation}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg space-y-3">
        {/* Content */}
        {content && (
          <>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {content.content}
            </p>
            {content.translation && (
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {content.translation}
              </p>
            )}
          </>
        )}

        {/* Contact Info */}
        {contact && (
          <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
            <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">📞</span>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                {contact.content}
              </p>
              {contact.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 whitespace-pre-wrap">
                  {contact.translation}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
