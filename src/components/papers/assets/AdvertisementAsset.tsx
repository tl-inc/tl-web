'use client';

import { memo } from 'react';
import type { AdvertisementAssetData } from '@/types/paper';

interface AdvertisementAssetProps {
  asset: AdvertisementAssetData;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export const AdvertisementAsset = memo(function AdvertisementAsset({ asset, mode }: AdvertisementAssetProps) {
  if (!asset?.advertisement) return null;

  return (
    <div className="p-5 bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-950/30 dark:to-pink-950/30 rounded-xl border border-rose-200/50 dark:border-rose-800/50">
      <div className="text-center mb-4">
        {/* Product Name */}
        {asset.product_name && (
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100">
              {asset.product_name?.content || asset.product_name}
            </h3>
            {mode === 'completed' && asset.product_name?.translation && (
              <p className="text-base text-rose-600 dark:text-rose-400 mt-1">
                {asset.product_name.translation}
              </p>
            )}
          </div>
        )}
        {/* Headline */}
        {asset.advertisement.headline && (
          <div className="mb-3">
            <p className="text-lg font-semibold text-rose-700 dark:text-rose-300 italic">
              {asset.advertisement.headline?.content || asset.advertisement.headline}
            </p>
            {mode === 'completed' && asset.advertisement.headline?.translation && (
              <p className="text-sm text-rose-500 dark:text-rose-400 mt-1 italic">
                {asset.advertisement.headline.translation}
              </p>
            )}
          </div>
        )}
        {asset.advertisement.price && (
          <div className="inline-block bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full mt-2">
            <span className="text-3xl font-bold">{asset.advertisement.price}</span>
          </div>
        )}
      </div>
      <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg space-y-3">
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
          {asset.advertisement.description?.content || asset.advertisement.description}
        </p>
        {mode === 'completed' && asset.advertisement.description?.translation && (
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
            {asset.advertisement.description.translation}
          </p>
        )}

        {/* Time Info */}
        {asset.advertisement.time_info && (
          <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
            <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">🕒</span>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {asset.advertisement.time_info?.content || asset.advertisement.time_info}
              </p>
              {mode === 'completed' && asset.advertisement.time_info?.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {asset.advertisement.time_info.translation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Location */}
        {asset.advertisement.location && (
          <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
            <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">📍</span>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {asset.advertisement.location?.content || asset.advertisement.location}
              </p>
              {mode === 'completed' && asset.advertisement.location?.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {asset.advertisement.location.translation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        {asset.advertisement.contact_info && (
          <div className="flex items-start gap-2 pt-2 border-t border-rose-100 dark:border-rose-900">
            <span className="text-rose-600 dark:text-rose-400 font-semibold min-w-[24px]">📞</span>
            <div className="flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {asset.advertisement.contact_info?.content || asset.advertisement.contact_info}
              </p>
              {mode === 'completed' && asset.advertisement.contact_info?.translation && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {asset.advertisement.contact_info.translation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Discount Info */}
        {asset.advertisement.discount_info && (
          <div className="mt-3 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border-l-4 border-amber-500">
            <p className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <span className="text-xl">💰</span>
              {asset.advertisement.discount_info?.content || asset.advertisement.discount_info}
            </p>
            {mode === 'completed' && asset.advertisement.discount_info?.translation && (
              <p className="text-amber-600 dark:text-amber-400 ml-7 mt-1">
                {asset.advertisement.discount_info.translation}
              </p>
            )}
          </div>
        )}

        {/* Promotional Text */}
        {asset.advertisement.promotional_text && (
          <div className="mt-3 p-3 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg border-l-4 border-orange-500">
            <p className="font-semibold text-orange-700 dark:text-orange-300 flex items-center gap-2">
              <span className="text-xl">🎉</span>
              {asset.advertisement.promotional_text?.content || asset.advertisement.promotional_text}
            </p>
            {mode === 'completed' && asset.advertisement.promotional_text?.translation && (
              <p className="text-orange-600 dark:text-orange-400 ml-7 mt-1">
                {asset.advertisement.promotional_text.translation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
