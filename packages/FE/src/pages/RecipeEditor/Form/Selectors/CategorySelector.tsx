import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGetCategories } from '@/queries/categories';
import i18n from '@/i18n';
import { Language } from '@/types/user';
import { Category } from '@/types/category';

interface RecipeCategory {
  categoryId: string;
  name: string;
}

interface CategorySelectorProps {
  categories: RecipeCategory[];
  onChange: (categories: RecipeCategory[]) => void;
  error?: string;
}

const CategorySelector = ({ categories, onChange, error }: CategorySelectorProps) => {
  const { t } = useTranslation();
  const { data: categoriesData = [] } = useGetCategories();

  const currentLang = i18n.language as Language;

  const availableCategories = useMemo(() => {
    return categoriesData.filter(
      (cat: Category) => !categories.some((selected) => selected.categoryId === cat.id)
    );
  }, [categoriesData, categories]);

  const handleAddCategory = (categoryId: string) => {
    const category = categoriesData.find((c: Category) => c.id === categoryId);
    if (!category) return;

    onChange([
      ...categories,
      {
        categoryId,
        name: category.content[currentLang]?.name || categoryId,
      },
    ]);
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(categories.filter((c) => c.categoryId !== categoryId));
  };

  return (
    <div className="space-y-4">
      <label
        className={cn(
          'text-xs font-semibold uppercase tracking-[0.1em]',
          'text-stone-500 dark:text-stone-400'
        )}
      >
        {t('pages.editor.sections.metadata.categories')}
      </label>

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <span
            key={cat.categoryId}
            className={cn(
              'bg-orange-100/80 dark:bg-orange-900/80',
              'px-3 py-1 rounded-full',
              'text-xs font-bold uppercase tracking-tight',
              'text-orange-800 dark:text-orange-200',
              'border border-orange-200/30 dark:border-orange-800/30',
              'flex items-center gap-2'
            )}
          >
            {cat.name}
            <button
              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-200 transition-colors"
              onClick={() => handleRemoveCategory(cat.categoryId)}
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {availableCategories.length > 0 && (
        <select
          className={cn(
            'w-full bg-transparent border-b border-stone-300 dark:border-stone-700',
            'focus:border-orange-700 dark:focus:border-orange-500',
            'py-2 text-stone-900 dark:text-stone-100'
          )}
          value=""
          onChange={(e) => e.target.value && handleAddCategory(e.target.value)}
        >
          <option value="">{t('pages.editor.select_category')}</option>
          {availableCategories.map((cat: Category) => (
            <option key={cat.id} value={cat.id}>
              {cat.content[currentLang]?.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategorySelector;