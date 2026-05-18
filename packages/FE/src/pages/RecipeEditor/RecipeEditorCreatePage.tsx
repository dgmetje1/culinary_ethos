import { useTranslation } from 'react-i18next';

import RecipeEditorForm from './Form/RecipeEditorForm';
import { cn } from '@/lib/utils';
import { Recipe } from '@/types/recipe';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/_mainLayout/editor/');

const RecipeEditorCreatePage = () => {
  const { t } = useTranslation();

  return (
    <div className={cn('min-h-screen bg-[#faf9f7] dark:bg-stone-950')}>
      <section className="pt-12 pb-5">
        <div className="max-w-[1200px] mx-auto px-8">
          <header className="mb-12">
            <h1 className="font-serif text-5xl text-stone-900 dark:text-stone-50 mb-2 italic">
              {t('pages.editor.title')}
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-xl">
              {t('pages.editor.description')}
            </p>
          </header>
        </div>
      </section>
      <RecipeEditorForm />
    </div>
  );
};

export default RecipeEditorCreatePage;
