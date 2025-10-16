'use client';

import { memo } from 'react';

import type { NoticeAssetData } from '@/types/paper';

interface NoticeAssetProps {
  asset: NoticeAssetData;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export const NoticeAsset = memo(function NoticeAsset({ asset, mode }: NoticeAssetProps) {
  if (!asset?.notice) return null;

  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
      <div className="border-l-4 border-indigo-500 pl-4 mb-4">
        <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
          {asset.notice.title?.content || asset.notice.title}
        </h3>
        {mode === 'completed' && asset.notice.title?.translation && (
          <p className="text-base text-indigo-600 dark:text-indigo-400 mt-1">
            {asset.notice.title.translation}
          </p>
        )}
      </div>
      <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg space-y-3">
        {asset.notice.date_time && (
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📅 Date & Time:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.date_time?.content || asset.notice.date_time}</span>
              {mode === 'completed' && asset.notice.date_time?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.date_time.translation}</span>
              )}
            </div>
          </div>
        )}
        {asset.notice.location && (
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📍 Location:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.location?.content || asset.notice.location}</span>
              {mode === 'completed' && asset.notice.location?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.location.translation}</span>
              )}
            </div>
          </div>
        )}
        <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
            {asset.notice.description?.content || asset.notice.description || asset.notice.content?.content || asset.notice.content}
          </p>
          {mode === 'completed' && (asset.notice.description?.translation || asset.notice.content?.translation) && (
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed mt-2">
              {asset.notice.description?.translation || asset.notice.content?.translation}
            </p>
          )}
        </div>
        {asset.notice.participant_info && (
          <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">👥 Participants:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.participant_info?.content || asset.notice.participant_info}</span>
              {mode === 'completed' && asset.notice.participant_info?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.participant_info.translation}</span>
              )}
            </div>
          </div>
        )}
        {asset.notice.fee_info && (
          <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">💰 Fee:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.fee_info?.content || asset.notice.fee_info}</span>
              {mode === 'completed' && asset.notice.fee_info?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.fee_info.translation}</span>
              )}
            </div>
          </div>
        )}
        {asset.notice.contact_info && (
          <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">📞 Contact:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.contact_info?.content || asset.notice.contact_info}</span>
              {mode === 'completed' && asset.notice.contact_info?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.contact_info.translation}</span>
              )}
            </div>
          </div>
        )}
        {asset.notice.requirements && (
          <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">✅ Requirements:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.requirements?.content || asset.notice.requirements}</span>
              {mode === 'completed' && asset.notice.requirements?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.requirements.translation}</span>
              )}
            </div>
          </div>
        )}
        {asset.notice.deadline && (
          <div className="flex items-start gap-2 pt-3 border-t border-indigo-100 dark:border-indigo-900">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">⏰ Deadline:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.notice.deadline?.content || asset.notice.deadline}</span>
              {mode === 'completed' && asset.notice.deadline?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.notice.deadline.translation}</span>
              )}
            </div>
          </div>
        )}
        {asset.organizer && (
          <div className="flex items-start gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold min-w-[100px]">👤 Organizer:</span>
            <div className="flex-1">
              <span className="text-gray-700 dark:text-gray-300">{asset.organizer?.content || asset.organizer}</span>
              {mode === 'completed' && asset.organizer?.translation && (
                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">{asset.organizer.translation}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
