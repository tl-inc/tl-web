'use client';

import { memo } from 'react';
import type {
  AssetJsonData,
  MenuAssetData,
  DialogueAssetData,
  TimetableAssetData,
  AdvertisementAssetData,
  NoticeAssetData,
} from '@/types/paper';
import { usePaperDataStore } from '@/stores/paper';
import { MenuAsset } from './MenuAsset';
import { NoticeAsset } from './NoticeAsset';
import { DialogueAsset } from './DialogueAsset';
import { AdvertisementAsset } from './AdvertisementAsset';
import { TimetableAsset } from './TimetableAsset';

interface AssetDisplayProps {
  asset: AssetJsonData;
}

/**
 * AssetDisplay 組件
 * 根據素材類型動態渲染對應的 Asset 組件
 */
export const AssetDisplay = memo(function AssetDisplay({ asset }: AssetDisplayProps) {
  const mode = usePaperDataStore((state) => state.mode);

  if (!asset) return null;

  // 根據 asset 的屬性判斷類型
  if ('menu' in asset) {
    return <MenuAsset asset={asset as MenuAssetData} mode={mode} />;
  }

  if ('dialogue' in asset || 'turns' in asset) {
    return <DialogueAsset asset={asset as DialogueAssetData} mode={mode} />;
  }

  if ('schedule' in asset) {
    return <TimetableAsset asset={asset as TimetableAssetData} mode={mode} />;
  }

  if ('company' in asset || ('title' in asset && 'content' in asset && 'contact' in asset)) {
    return <AdvertisementAsset asset={asset as AdvertisementAssetData} mode={mode} />;
  }

  if ('title' in asset && 'content' in asset) {
    return <NoticeAsset asset={asset as NoticeAssetData} mode={mode} />;
  }

  // Passage type (for Cloze exercises) - 直接不顯示，因為文章會在題目中顯示
  if ('passage' in asset) {
    return null;
  }

  // Fallback: unknown asset type (只在開發環境顯示警告)
  if (process.env.NODE_ENV === 'development') {
    console.warn('Unknown asset type:', asset);
  }

  return null;
});

export default AssetDisplay;
