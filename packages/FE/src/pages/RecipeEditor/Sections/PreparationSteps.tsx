import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/components/common/RichTextEditor/RichTextEditor';
import RecipeImageUpload from '../ImageUpload/RecipeImageUpload';

interface Step {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageFile?: File;
}

interface PreparationStepsProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

const PreparationSteps = ({ steps, onChange }: PreparationStepsProps) => {
  const { t } = useTranslation();

  const handleAddStep = () => {
    onChange([
      ...steps,
      { id: Date.now().toString(), title: '', description: '' },
    ]);
  };

  const handleUpdateStepTitle = (id: string, title: string) => {
    onChange(steps.map((step) => (step.id === id ? { ...step, title } : step)));
  };

  const handleUpdateStepDescription = (id: string, description: string) => {
    onChange(
      steps.map((step) => (step.id === id ? { ...step, description } : step)),
    );
  };

  const handleUpdateStepImage = (id: string, imageFile?: File) => {
    onChange(
      steps.map((step) => {
        if (step.id !== id) return step;
        if (imageFile) {
          return { ...step, imageFile };
        }
        return { ...step, imageFile: undefined };
      }),
    );
  };

  const formatStepNumber = (index: number) => {
    return (index + 1).toString().padStart(2, '0');
  };

  return (
    <section className="space-y-8">
      <h3
        className={cn(
          'text-xl font-serif',
          'text-stone-900 dark:text-stone-100',
          'border-b border-stone-300 dark:border-stone-700 pb-4',
        )}
      >
        {t('pages.editor.sections.steps.title')}
      </h3>
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              'flex flex-col lg:flex-row gap-6',
              'bg-white/40 dark:bg-stone-900/40',
              'p-6 rounded-xl',
              'border border-white/20 dark:border-stone-800/20',
              'transition-all hover:bg-white/60 dark:hover:bg-stone-900/60',
            )}
          >
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <span
                className={cn(
                  'text-4xl font-serif italic',
                  'text-orange-700/30 dark:text-orange-500/30',
                  'transition-colors shrink-0',
                )}
              >
                {formatStepNumber(index)}
              </span>
              <div className="w-full lg:w-32 h-32 flex-shrink-0">
                <RecipeImageUpload
                  thumbnailFile={step.imageFile}
                  thumbnailUrl={step.imageUrl}
                  onChange={(file) => handleUpdateStepImage(step.id, file)}
                  aspectRatio={5 / 4}
                  showRecommendation={false}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-4">
              <Input
                className={cn(
                  'bg-white/50 dark:bg-stone-800/50',
                  'border-none text-lg font-medium',
                  'placeholder:text-stone-400',
                  'text-stone-900 dark:text-stone-100',
                )}
                placeholder={t('pages.editor.sections.steps.title_placeholder')}
                value={step.title}
                onChange={(e) => handleUpdateStepTitle(step.id, e.target.value)}
              />
              <RichTextEditor
                value={step.description}
                onChange={(value) =>
                  handleUpdateStepDescription(step.id, value)
                }
                placeholder={t('pages.editor.sections.steps.placeholder')}
                className="bg-white/50 dark:bg-stone-800/50 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        className={cn(
          'w-full py-6',
          'border border-dashed border-stone-400 dark:border-stone-600',
          'rounded-xl hover:bg-white/40 dark:hover:bg-stone-900/40',
          'transition-all flex items-center justify-center gap-2',
          'text-xs font-semibold uppercase tracking-widest',
          'text-stone-500 dark:text-stone-400',
        )}
        variant="ghost"
        onClick={handleAddStep}
        type="button"
      >
        <Plus className="w-4 h-4" />
        {t('pages.editor.sections.steps.add_step')}
      </Button>
    </section>
  );
};

export default PreparationSteps;
