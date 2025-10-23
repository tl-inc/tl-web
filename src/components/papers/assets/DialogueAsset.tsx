'use client';

import { memo } from 'react';
import type { DialogueAssetData, MenuItemContent } from '@/types/paper';

interface DialogueAssetProps {
  asset: DialogueAssetData;
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

export const DialogueAsset = memo(function DialogueAsset({ asset, mode }: DialogueAssetProps) {
  if (!asset?.turns || asset.turns.length === 0) return null;

  const title = renderField(asset.title, mode);
  const setting = renderField(asset.setting, mode);

  return (
    <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
      {/* Title */}
      {title && (
        <div className="mb-3 text-center">
          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
            {title.content}
          </h3>
          {title.translation && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
              {title.translation}
            </p>
          )}
        </div>
      )}

      {/* Setting */}
      {setting && (
        <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-emerald-500">
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">💬 Setting</div>
          <p className="text-gray-700 dark:text-gray-300">
            {setting.content}
          </p>
          {setting.translation && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {setting.translation}
            </p>
          )}
        </div>
      )}

      {/* Dialogue Turns */}
      <div className="space-y-3">
        {asset.turns.map((turn, idx) => {
          const speaker = renderField(turn.speaker, mode);
          const text = renderField(turn.text, mode);

          if (!speaker || !text) return null;

          // Alternate bubble styles based on index
          const isLeft = idx % 2 === 0;

          return (
            <div key={idx} className={`flex gap-3 ${isLeft ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${isLeft ? 'bg-white/70 dark:bg-gray-800/70' : 'bg-emerald-100/70 dark:bg-emerald-900/30'} p-3 rounded-lg`}>
                {/* Speaker Name */}
                <div className={`font-semibold text-sm mb-1 ${isLeft ? 'text-gray-600 dark:text-gray-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  {speaker.content}
                  {speaker.translation && (
                    <span className="font-normal text-xs ml-1">({speaker.translation})</span>
                  )}
                </div>
                {/* Dialogue Text */}
                <div className="text-gray-800 dark:text-gray-200">
                  {text.content}
                </div>
                {text.translation && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {text.translation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
