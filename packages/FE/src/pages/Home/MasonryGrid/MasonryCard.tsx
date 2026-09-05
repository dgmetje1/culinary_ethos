import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Bookmark } from 'lucide-react';

import AuthorName from '@/components/common/AuthorName/AuthorName';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { cn, composeCdnUrl } from '@/lib/utils';
import { RecipeListItem } from '@/types/recipe';

type MasonryCardProps = {
  recipe: RecipeListItem;
  isSaved: boolean;
  onToggleSave?: (id: string) => void;
  isPending?: boolean;
  showSaveButton?: boolean;
};

const MasonryCard = ({
  recipe,
  isSaved,
  onToggleSave,
  isPending,
  showSaveButton = true,
}: MasonryCardProps) => {
  const { t } = useTranslation();
  const imgSrc = composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl);

  return (
    <div className={cn('break-inside-avoid group cursor-pointer mb-6')}>
      <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
        <div
          className={cn(
            'relative overflow-hidden mb-3',
            'rounded-xl',
            'transition-all duration-500',
            'group-hover:scale-[1.02]',
          )}
        >
          {imgSrc && (
            <img
              src={imgSrc}
              alt={recipe.title}
              className={cn(
                'w-full object-cover',
                'rounded-xl',
                'transition-all duration-500',
                'group-hover:scale-105',
              )}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          {showSaveButton && onToggleSave && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-4 right-4',
                isSaved
                  ? 'bg-orange-500/80 text-white'
                  : 'bg-white/30 backdrop-blur-xl text-white hover:bg-white/50',
                'rounded-full p-2',
                'transition-all active:scale-90',
                'shadow-sm border border-white/20',
                'h-auto w-auto min-h-0 min-w-0',
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(recipe.id);
              }}
              disabled={isPending}
              title={t(isSaved ? 'recipe.unsave' : 'recipe.save')}
            >
              <Bookmark
                className="w-4 h-4 transition-all"
                fill={isSaved ? 'currentColor' : 'none'}
              />
            </Button>
          )}
        </div>
      </Link>
      <span
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.1em]',
          'text-stone-600 dark:text-stone-400',
        )}
      >
        {recipe.categories?.[0]?.name} &bull;{' '}
        {Math.floor(recipe.time / 60)} {t('pages.home.recipes.minutes')}
      </span>
      <Link params={{ id: recipe.id.toString() }} to="/recipe/$id">
        <h3
          className={cn(
            'text-2xl font-serif font-medium',
            'text-stone-900 dark:text-stone-100',
            'mt-2',
            'group-hover:text-orange-700 dark:group-hover:text-orange-500',
            'transition-colors',
          )}
          style={{ fontFamily: "'Noto Serif', serif" }}
        >
          {recipe.title}
        </h3>
      </Link>
      <p
        className={cn(
          'text-base text-stone-600 dark:text-stone-400',
          'mt-1',
        )}
      >
        {t('common.by')} <AuthorName authorId={recipe.author} />
      </p>
    </div>
  );
};

export default MasonryCard;
