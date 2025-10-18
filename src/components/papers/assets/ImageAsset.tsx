'use client';

import { memo } from 'react';
import type { ImageAssetData } from '@/types/paper';
import Image from 'next/image';

interface ImageAssetProps {
  asset: ImageAssetData;
}

/**
 * ImageAsset 組件
 * 顯示圖片素材（用於圖片理解題等）
 * 只顯示圖片，不顯示 caption（caption 會在題目本身顯示）
 */
export const ImageAsset = memo(function ImageAsset({ asset }: ImageAssetProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
      <Image
        src={asset.image_url}
        alt={asset.caption || ''}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
});
