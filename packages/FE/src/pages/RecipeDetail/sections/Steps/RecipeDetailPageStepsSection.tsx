import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { RecipeStep } from '@/types/recipe';
import config from '@/config';

interface RecipeDetailPageStepsSectionProps {
  steps: RecipeStep[];
}

const RecipeDetailPageStepsSection = ({
  steps,
}: RecipeDetailPageStepsSectionProps) => {
  if (!steps || !steps.length) return null;

  const { t } = useTranslation();
  const formatStepNumber = (index: number) => {
    return (index + 1).toString().padStart(2, '0');
  };

  return (
    <div className="space-y-16">
      {steps.map((step, index) => (
        <div
          key={`step-${step.id}`}
          className="flex flex-col md:flex-row gap-8 md:gap-12"
        >
          <div className="flex-shrink-0">
            <span
              className={cn(
                'text-4xl font-serif italic',
                'text-orange-700 dark:text-orange-500',
                'opacity-40 block',
              )}
            >
              {formatStepNumber(index)}
            </span>
          </div>
          <div className="flex-grow space-y-4">
            <h4 className="text-xl md:text-2xl font-serif text-stone-900 dark:text-stone-100">
              {step.title}
            </h4>
            <div
              className="prose prose-stone dark:prose-invert prose-lg max-w-none
                prose-p:text-stone-600 dark:prose-p:text-stone-400
                prose-p:leading-relaxed
                prose-ul:text-stone-600 dark:prose-ul:text-stone-400
                prose-ol:text-stone-600 dark:prose-ol:text-stone-400
                prose-li:marker:text-orange-500
                prose-strong:text-stone-900 dark:prose-strong:text-stone-100
                prose-em:text-stone-700 dark:prose-em:text-stone-300
                prose-a:text-orange-700 dark:prose-a:text-orange-500
                prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(step.body) }}
            />
            {step.imageUrl && (
              <img
                alt={step.title}
                className="w-full aspect-[5/4] object-cover rounded-xl mt-6"
                src={`${config.cdnUrl}${step.imageUrl}`}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeDetailPageStepsSection;
