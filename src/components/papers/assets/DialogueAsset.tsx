'use client';

interface DialogueAssetProps {
  asset: any;
  mode: 'pending' | 'in_progress' | 'completed' | 'abandoned';
}

export function DialogueAsset({ asset, mode }: DialogueAssetProps) {
  if (!asset?.dialogue) return null;

  const turns = asset.dialogue.turns || [];
  const speakers = asset.dialogue.speakers || [];

  return (
    <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
      {/* Scenario */}
      {asset.scenario && (
        <div className="mb-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border-l-4 border-emerald-500">
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">💬 Scenario</div>
          <p className="text-gray-700 dark:text-gray-300">
            {asset.scenario?.content || asset.scenario}
          </p>
          {mode === 'completed' && asset.scenario?.translation && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {asset.scenario.translation}
            </p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {turns.map((turn: any, idx: number) => {
          const speaker = speakers[turn.speaker_index];
          const speakerName = speaker?.name?.content || speaker?.name || `Speaker ${turn.speaker_index + 1}`;
          const speakerNameTranslation = speaker?.name?.translation;
          const speakerRole = speaker?.role?.content || speaker?.role;
          const speakerRoleTranslation = speaker?.role?.translation;
          const text = turn.text?.content || turn.text || turn.message?.content || turn.message;
          const textTranslation = turn.text?.translation || turn.message?.translation;

          return (
            <div key={idx} className={`flex gap-3 ${turn.speaker_index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] ${turn.speaker_index % 2 === 0 ? 'bg-white/70 dark:bg-gray-800/70' : 'bg-emerald-100/70 dark:bg-emerald-900/30'} p-3 rounded-lg`}>
                <div className={`font-semibold text-sm mb-1 ${turn.speaker_index % 2 === 0 ? 'text-gray-600 dark:text-gray-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                  {speakerName}
                  {mode === 'completed' && speakerNameTranslation && (
                    <span className="font-normal text-xs ml-1">({speakerNameTranslation})</span>
                  )}
                  {speakerRole && (
                    <span className="font-normal text-xs ml-2 opacity-70">
                      - {speakerRole}
                      {mode === 'completed' && speakerRoleTranslation && (
                        <span> ({speakerRoleTranslation})</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="text-gray-800 dark:text-gray-200">
                  {text}
                </div>
                {mode === 'completed' && textTranslation && (
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {textTranslation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
