'use client';

import { memo, useMemo } from 'react';
import type { Exercise } from '@/types/paper';
import { CheckCircle, XCircle } from 'lucide-react';
import { MenuAsset } from '../assets/MenuAsset';
import { NoticeAsset } from '../assets/NoticeAsset';
import { TimetableAsset } from '../assets/TimetableAsset';
import { AdvertisementAsset } from '../assets/AdvertisementAsset';
import { DialogueAsset } from '../assets/DialogueAsset';

interface ItemSetExerciseProps {
  exercise: Exercise;
  answers: Map<number, number>;
  onAnswerChange: (exerciseId: number, itemId: number, answerIndex: number) => void;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export const ItemSetExercise = memo(function ItemSetExercise({ exercise, answers, onAnswerChange, mode }: ItemSetExerciseProps) {
  const passageText = exercise.passage || exercise.asset_json?.passage;
  const imageUrl = exercise.image_url || exercise.asset_json?.image_url;
  const audioUrl = exercise.audio_url || exercise.asset_json?.audio_url;

  // Listening comprehension (type 7) shows transcript only in completed mode
  const isListening = exercise.exercise_type_id === 7;
  const shouldShowPassage = passageText && (!isListening || mode === 'completed');

  // Information reading (8-12) renders asset_json
  const isInformationReading = exercise.exercise_type_id >= 8 && exercise.exercise_type_id <= 12;

  // Memoize asset rendering to avoid re-rendering on every state change
  const informationAsset = useMemo(() => {
    if (!isInformationReading) return null;
    const asset = exercise.asset_json;
    if (!asset) return null;

    const typeId = exercise.exercise_type_id;

    if (typeId === 8) return <MenuAsset asset={asset} mode={mode} />;
    if (typeId === 9) return <NoticeAsset asset={asset} mode={mode} />;
    if (typeId === 10) return <TimetableAsset asset={asset} mode={mode} />;
    if (typeId === 11) return <AdvertisementAsset asset={asset} mode={mode} />;
    if (typeId === 12) return <DialogueAsset asset={asset} mode={mode} />;

    return null;
  }, [isInformationReading, exercise.asset_json, exercise.exercise_type_id, mode]);

  return (
    <div className="space-y-4">
      {/* Image */}
      {imageUrl && (
        <div className="flex justify-center">
          <img src={imageUrl} alt="Exercise" className="max-w-full rounded-lg shadow-lg" />
        </div>
      )}

      {/* Audio */}
      {audioUrl && (
        <audio controls className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Information reading asset (8-12) */}
      {informationAsset}

      {/* Passage (show transcript only in completed mode for listening) */}
      {!isInformationReading && shouldShowPassage && (
        <div className="p-5 bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-slate-950/30 dark:to-gray-950/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {passageText}
          </div>
          {/* Show passage translation */}
          {mode === 'completed' && exercise.asset_json?.translation && (
            <div className="mt-4 pt-4 border-t border-slate-300/50 dark:border-slate-600/50 whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed">
              {exercise.asset_json.translation}
            </div>
          )}
        </div>
      )}

      {/* Sub-questions */}
      <div className="space-y-5">
        {exercise.exercise_items.map((item, itemIdx) => {
          const userAnswer = answers.get(item.id);
          const displayQuestion = item.question?.replace(/\{\{blank(_\d+)?\}\}/g, '____') || '';
          const isUnanswered = userAnswer === undefined;
          const showCorrect = mode === 'completed';

          return (
            <div key={item.id} className="bg-white/40 dark:bg-gray-800/40 p-4 rounded-lg">
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm flex-shrink-0">
                  {itemIdx + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">{displayQuestion}</div>
                    {/* Unanswered badge */}
                    {showCorrect && isUnanswered && (
                      <span className="px-2 py-1 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700 whitespace-nowrap">
                        ⚠️ 未作答
                      </span>
                    )}
                  </div>
                  {/* Show question translation */}
                  {showCorrect && item.metadata?.translation && (
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-normal">
                      {item.metadata.translation}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 ml-8">
                {item.options.map((option, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  const isCorrect = option.is_correct;

                  return (
                    <div key={optIdx}>
                      <label
                        className={`
                          flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                          ${(mode !== 'in_progress' && mode !== 'pending') ? 'cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.01]'}
                          ${isSelected && !showCorrect ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60'}
                          ${showCorrect && isCorrect && !isUnanswered ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20 shadow-sm' : ''}
                          ${showCorrect && isSelected && !isCorrect ? 'border-red-400 bg-red-50/50 dark:bg-red-900/20 shadow-sm' : ''}
                          ${showCorrect && isCorrect && isUnanswered ? 'border-green-400 bg-green-50/50 dark:bg-green-900/20 shadow-sm' : ''}
                        `}
                      >
                        <input
                          type="radio"
                          name={`item-${item.id}`}
                          value={optIdx}
                          checked={isSelected}
                          onChange={() => onAnswerChange(exercise.id, item.id, optIdx)}
                          disabled={mode !== 'in_progress' && mode !== 'pending'}
                          className="mr-3"
                        />
                        <span className="flex-1 text-gray-900 dark:text-gray-100">{option.text}</span>
                        {showCorrect && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 ml-2" />
                        )}
                        {showCorrect && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 ml-2" />
                        )}
                      </label>
                      {/* Show why_correct for correct answer (always show in completed mode) */}
                      {showCorrect && option.is_correct && option.why_correct && (
                        <div className="mt-2 ml-3 p-2 bg-gray-50/80 dark:bg-gray-900/80 rounded text-xs">
                          <div className="text-green-700 dark:text-green-300">
                            <span className="font-semibold">✓ </span>{option.why_correct}
                          </div>
                        </div>
                      )}
                      {/* Show why_incorrect for selected wrong answer */}
                      {showCorrect && isSelected && !isCorrect && option.why_incorrect && (
                        <div className="mt-2 ml-3 p-2 bg-gray-50/80 dark:bg-gray-900/80 rounded text-xs">
                          <div className="text-red-700 dark:text-red-300">
                            <span className="font-semibold">✗ </span>{option.why_incorrect}
                          </div>
                        </div>
                      )}
                      {/* Show why_incorrect for correct answer if unanswered (to show what would be wrong) */}
                      {showCorrect && isUnanswered && !option.is_correct && option.why_incorrect && (
                        <div className="mt-2 ml-3 p-2 bg-gray-50/80 dark:bg-gray-900/80 rounded text-xs">
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">ℹ️ </span>{option.why_incorrect}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
