import { useTranslation } from 'react-i18next';
import { Plus, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/components/common/RichTextEditor/RichTextEditor';

interface Step {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface PreparationStepsProps {
  steps: Step[];
  onChange: (steps: Step[]) => void;
}

const PreparationSteps = ({ steps, onChange }: PreparationStepsProps) => {
  const { t } = useTranslation();

  const handleAddStep = () => {
    onChange([...steps, { id: Date.now().toString(), title: '', description: '' }]);
  };

  const handleUpdateStepTitle = (id: string, title: string) => {
    onChange(steps.map((step) => (step.id === id ? { ...step, title } : step)));
  };

  const handleUpdateStepDescription = (id: string, description: string) => {
    onChange(steps.map((step) => (step.id === id ? { ...step, description } : step)));
  };

  const handleUpdateStepImage = (id: string, imageUrl: string) => {
    onChange(steps.map((step) => (step.id === id ? { ...step, imageUrl } : step)));
  };

  const handleRemoveStepImage = (id: string) => {
    onChange(steps.map((step) => (step.id === id ? { ...step, imageUrl: undefined } : step)));
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
          'border-b border-stone-300 dark:border-stone-700 pb-4'
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
              'transition-all hover:bg-white/60 dark:hover:bg-stone-900/60'
            )}
          >
            <div className="flex flex-col gap-3 items-center lg:items-start">
              <span
                className={cn(
                  'text-4xl font-serif italic',
                  'text-orange-700/30 dark:text-orange-500/30',
                  'transition-colors shrink-0'
                )}
              >
                {formatStepNumber(index)}
              </span>
              <div
                className={cn(
                  'w-full lg:w-32 h-32 rounded-lg',
                  'bg-stone-100 dark:bg-stone-800',
                  'border border-dashed border-stone-300 dark:border-stone-700',
                  'flex flex-col items-center justify-center',
                  'cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700',
                  'transition-colors overflow-hidden relative',
                  'flex-shrink-0'
                )}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => handleUpdateStepImage(step.id, reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                }}
              >
                {step.imageUrl ? (
                  <>
                    <img
                      alt={`Step ${index + 1}`}
                      className="w-full h-full object-cover"
                      src={step.imageUrl}
                    />
                    <button
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 rounded-full p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveStepImage(step.id);
                      }}
                      type="button"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <ImagePlus className="text-xl text-stone-400 mb-1" />
                    <span
                      className={cn(
                        'text-[10px] font-semibold uppercase tracking-tighter',
                        'text-stone-400 text-center px-1'
                      )}
                    >
                      {t('pages.editor.sections.steps.add_photo')}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-4">
              <Input
                className={cn(
                  'bg-white/50 dark:bg-stone-800/50',
                  'border-none text-lg font-medium',
                  'placeholder:text-stone-400',
                  'text-stone-900 dark:text-stone-100'
                )}
                placeholder={t('pages.editor.sections.steps.title_placeholder')}
                value={step.title}
                onChange={(e) => handleUpdateStepTitle(step.id, e.target.value)}
              />
              <RichTextEditor
                value={step.description}
                onChange={(value) => handleUpdateStepDescription(step.id, value)}
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
          'text-stone-500 dark:text-stone-400'
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