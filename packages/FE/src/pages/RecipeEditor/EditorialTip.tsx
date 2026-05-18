import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';

import { cn } from '@/lib/utils';

const EditorialTip = () => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'bg-amber-100/80 dark:bg-amber-900/80',
        'backdrop-blur-md p-6 rounded-xl',
        'flex gap-4',
        'border border-amber-200/30 dark:border-amber-800/30'
      )}
    >
      <Lightbulb className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
      <div>
        <p
          className={cn(
            'text-xs font-semibold uppercase tracking-tight',
            'text-amber-800 dark:text-amber-200 mb-1'
          )}
        >
          {t('pages.editor.sections.tip.title')}
        </p>
        <p
          className={cn(
            'text-xs leading-relaxed',
            'text-amber-900 dark:text-amber-300'
          )}
        >
          {t('pages.editor.sections.tip.content')}
        </p>
      </div>
    </div>
  );
};

export default EditorialTip;