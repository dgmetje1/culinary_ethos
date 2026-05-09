import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const HomePageBanner = () => {
  const { t } = useTranslation();

  return (
    <section
      className={cn('flex flex-col', 'pb-16', 'max-w-[1200px] mx-auto', 'px-8')}
    >
      <span
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.1em]',
          'text-orange-700 dark:text-orange-500',
          'mb-4',
        )}
      >
        {t('pages.home.banner.edition')}
      </span>
      <h1
        className={cn(
          'text-[48px] leading-[1.1] -tracking-[0.02em]',
          'text-stone-900 dark:text-stone-100',
          'font-serif mb-6',
        )}
        style={{ fontFamily: "'Noto Serif', serif" }}
      >
        {t('pages.home.banner.title')}
      </h1>
      <p
        className={cn(
          'text-lg leading-[1.6]',
          'text-stone-600 dark:text-stone-400',
          'max-w-2xl',
        )}
      >
        {t('pages.home.banner.description')}
      </p>
    </section>
  );
};

export default HomePageBanner;
