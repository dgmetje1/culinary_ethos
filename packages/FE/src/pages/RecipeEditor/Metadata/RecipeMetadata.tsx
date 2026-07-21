import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

interface RecipeMetadataProps {
  time: number;
  difficulty: string;
  portions: number;
  onTimeChange: (time: number) => void;
  onDifficultyChange: (difficulty: string) => void;
  onPortionsChange: (portions: number) => void;
  timeError?: string;
  portionsError?: string;
}

const RecipeMetadata = ({
  time,
  difficulty,
  portions,
  onTimeChange,
  onDifficultyChange,
  onPortionsChange,
  timeError,
  portionsError,
}: RecipeMetadataProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'bg-white/60 dark:bg-stone-900/60',
        'backdrop-blur-xl',
        'p-8 rounded-xl',
        'border border-stone-200/50 dark:border-stone-800/50',
        'shadow-sm space-y-6',
      )}
    >
      <h4
        className={cn(
          'text-xs font-semibold uppercase tracking-widest',
          'text-stone-500 dark:text-stone-400',
        )}
      >
        {t('pages.editor.sections.metadata.title')}
      </h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-stone-200/20 dark:border-stone-700/20">
          <label className={cn('text-base text-stone-600 dark:text-stone-400')}>
            {t('pages.editor.sections.metadata.time')}
          </label>
          <div className="flex flex-col items-end gap-1">
            <select
              className={cn(
                'bg-transparent border-none',
                'font-base text-stone-900 dark:text-stone-100 text-right',
                'focus:ring-0 cursor-pointer',
                timeError && 'text-red-500',
              )}
              value={time}
              onChange={(e) => onTimeChange(Number(e.target.value))}
            >
              <option value="0" disabled>
                Select time
              </option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1h</option>
              <option value="90">1h 30min</option>
              <option value="120">2h</option>
              <option value="180">3h+</option>
            </select>
            {timeError && (
              <span className="text-xs text-red-500">{timeError}</span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-stone-200/20 dark:border-stone-700/20">
          <label className={cn('text-base text-stone-600 dark:text-stone-400')}>
            {t('pages.editor.sections.metadata.difficulty')}
          </label>
          <select
            className={cn(
              'bg-transparent border-none',
              'font-base text-stone-900 dark:text-stone-100 text-right',
              'focus:ring-0 cursor-pointer',
            )}
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
          >
            <option value="beginner">
              {t('pages.editor.difficulty.beginner')}
            </option>
            <option value="intermediate">
              {t('pages.editor.difficulty.intermediate')}
            </option>
            <option value="advanced">
              {t('pages.editor.difficulty.advanced')}
            </option>
          </select>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-stone-200/20 dark:border-stone-700/20">
          <label className={cn('text-base text-stone-600 dark:text-stone-400')}>
            {t('pages.editor.sections.metadata.portions')}
          </label>
          <div className="flex flex-col items-end gap-1">
            <input
              className={cn(
                'bg-transparent border-none',
                'font-base text-stone-900 dark:text-stone-100 text-right',
                'focus:ring-0 w-16',
                portionsError && 'text-red-500',
              )}
              type="number"
              min="1"
              max="20"
              value={portions}
              onChange={(e) => onPortionsChange(parseInt(e.target.value) || 1)}
            />
            {portionsError && (
              <span className="text-xs text-red-500">{portionsError}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeMetadata;
