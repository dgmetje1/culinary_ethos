import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import HomePageMasonryGrid from '../MasonryGrid';
import { useHomePageContext } from '../Context';

const HomePageContent = () => {
  const { t } = useTranslation();
  const { setItemsVisible } = useHomePageContext();

  return (
    <div className={cn('max-w-[1200px] mx-auto', 'w-full pb-20 px-6')}>
      <HomePageMasonryGrid />
      <div className="mt-20 flex justify-center">
        <Button
          variant="outline"
          className={cn(
            'border-stone-300 dark:border-stone-700',
            'px-12 py-4 rounded-full',
            'text-xs font-semibold uppercase tracking-[0.1em]',
            'hover:bg-stone-900 hover:text-white',
            'dark:hover:bg-white dark:hover:text-stone-900',
            'transition-all duration-300',
            'bg-white/5 dark:bg-stone-900/50',
            'backdrop-blur-md',
          )}
          onClick={() => setItemsVisible((prev) => prev + 6)}
        >
          {t('pages.home.recipes.load_more')}
        </Button>
      </div>
    </div>
  );
};

export default HomePageContent;
