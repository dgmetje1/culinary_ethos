import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { useCreateRecipe, useUpdateRecipe } from '@/queries/recipes';
import { useUploadFile, UploadFileResponse } from '@/queries/files';
import { CreateRecipeDTO } from '@/types/createRecipe';
import { Recipe } from '@/types/recipe';
import i18n from '@/i18n';

import RecipeTitleInput from '../Inputs/RecipeTitleInput';
import RecipeDescriptionInput from '../Inputs/RecipeDescriptionInput';
import IngredientSelector from './Selectors/IngredientSelector';
import KitchenwareSelector from './Selectors/KitchenwareSelector';
import CategorySelector from './Selectors/CategorySelector';
import PreparationSteps from '../Sections/PreparationSteps';
import RecipeImageUpload from '../ImageUpload/RecipeImageUpload';
import RecipeMetadata from '../Metadata/RecipeMetadata';
import EditorialTip from '../EditorialTip';

const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  author: z.string().optional(),
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      unitId: z.string().nullable(),
      quantity: z.number(),
      isOptional: z.boolean(),
      name: z.string(),
    }),
  ),
  kitchenware: z.array(
    z.object({
      kitchenwareId: z.string(),
      quantity: z.number(),
      name: z.string(),
    }),
  ),
  categories: z
    .array(
      z.object({
        categoryId: z.string(),
        name: z.string(),
      }),
    )
    .min(1, 'At least one category is required'),
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
  time: z.number().min(1, 'Time must be greater than 0'),
  difficulty: z.string(),
  portions: z.number(),
  thumbnailFile: z.instanceof(File).optional(),
  thumbnailUrl: z.string().optional(),
  headerImgFile: z.instanceof(File).optional(),
  headerImgUrl: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeFormSchema>;

const parseDifficulty = (difficulty: string): number => {
  switch (difficulty) {
    case 'beginner':
      return 1;
    case 'intermediate':
      return 2;
    case 'advanced':
      return 3;
    default:
      return 2;
  }
};

const transformToCreateRecipeDto = (data: RecipeFormData): CreateRecipeDTO => {
  const currentLanguage = i18n.language as 'en' | 'es' | 'ca' | 'fr';

  return {
    difficulty: parseDifficulty(data.difficulty),
    time: data.time,
    portions: data.portions,
    visibility: 1,
    author: data.author || 'anonymous',
    thumbnailUrl: data.thumbnailUrl,
    publications: [
      {
        language: currentLanguage,
        title: data.title,
        description: data.description || '',
      },
    ],
    categories: data.categories.map((c) => c.categoryId),
    ingredients: data.ingredients.map((ing) => ({
      id: ing.ingredientId,
      unitId: ing.unitId,
      quantity: ing.quantity,
      isOptional: ing.isOptional,
    })),
    kitchenware: data.kitchenware.map((k) => ({
      id: k.kitchenwareId,
      quantity: k.quantity,
    })),
    steps: data.steps
      .filter((step) => {
        const textOnly = step.description.replace(/<[^>]*>/g, '').trim();
        return textOnly !== '';
      })
      .map((step, index) => ({
        number: index + 1,
        content: [
          {
            language: currentLanguage,
            title: step.title || `Step ${index + 1}`,
            body: sanitizeHtml(step.description),
          },
        ],
      })),
    headerImg: data.headerImgUrl,
  };
};

const defaultValues: RecipeFormData = {
  title: '',
  description: '',
  author: '',
  ingredients: [],
  kitchenware: [],
  categories: [],
  steps: [
    { id: '1', title: '', description: '' },
    { id: '2', title: '', description: '' },
  ],
  time: 0,
  difficulty: 'intermediate',
  portions: 2,
  headerImgUrl: undefined,
};

interface RecipeEditorFormProps {
  initialData?: Recipe;
}

const RecipeEditorForm = ({ initialData }: RecipeEditorFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const router = useRouter();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const uploadFile = useUploadFile();

  const isEditing = !!initialData;

  const getInitialValues = (): RecipeFormData => {
    if (!initialData) return defaultValues;

    return {
      title: initialData.title,
      description: initialData.description,
      author: initialData.author,
      ingredients: initialData.ingredients.map((ing) => ({
        ingredientId: ing.id,
        unitId: ing.unit?.id || null,
        quantity: ing.quantity,
        isOptional: ing.optional,
        name: (ing as unknown as { name?: string }).name || '',
      })),
      kitchenware: (
        initialData.kitchenware as Array<{ id: string; quantity?: number }>
      ).map((k) => ({
        kitchenwareId: k.id,
        quantity: k.quantity || 1,
        name: '',
      })),
      categories: initialData.categories.map((c) => ({
        categoryId: c.id,
        name: c.name || '',
      })),
      steps: initialData.steps.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.body,
      })),
      time: initialData.time,
      difficulty:
        initialData.difficulty === 1
          ? 'beginner'
          : initialData.difficulty === 3
            ? 'advanced'
            : 'intermediate',
      portions: initialData.portions,
      thumbnailUrl: initialData.thumbnailUrl || undefined,
      headerImgUrl: initialData.headerImg || undefined,
    };
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (initialData) {
      reset(getInitialValues());
    }
  }, [initialData, reset]);

  const formData = watch();

  const onSubmit = async (data: RecipeFormData) => {
    let thumbnailUrl = data.thumbnailUrl;
    let headerImgUrl = data.headerImgUrl;

    if (data.thumbnailFile) {
      try {
        const uploadResult = (await uploadFile.mutateAsync({
          file: data.thumbnailFile,
          category: 'recipes',
        })) as UploadFileResponse;
        thumbnailUrl = uploadResult.relativePath;
      } catch (error) {
        console.error('Failed to upload thumbnail:', error);
        return;
      }
    }

    if (data.headerImgFile) {
      try {
        const uploadResult = (await uploadFile.mutateAsync({
          file: data.headerImgFile,
          category: 'recipes',
        })) as UploadFileResponse;
        headerImgUrl = uploadResult.relativePath;
      } catch (error) {
        console.error('Failed to upload header image:', error);
        return;
      }
    }

    const dto = transformToCreateRecipeDto({
      ...data,
      thumbnailUrl,
      headerImgUrl,
    });

    try {
      if (isEditing && initialData) {
        await updateRecipe.mutateAsync({ id: initialData.id, data: dto });
        toast.success(t('pages.editor.toast.updateSuccess'));
      } else {
        const recipeId = await createRecipe.mutateAsync(dto);
        toast.success(t('pages.editor.toast.createSuccess'));
        navigate({
          to: '/editor/$id',
          params: { id: recipeId },
        });
      }
    } catch (error) {
      toast.error(t('pages.editor.toast.error'));
    }
  };

  const handleDiscard = () => {
    reset(defaultValues);
  };

  const handleImageChange = (file: File | undefined) => {
    setValue('thumbnailFile', file, { shouldValidate: true });
  };

  const handleHeaderImageChange = (file: File | undefined) => {
    setValue('headerImgFile', file, { shouldValidate: true });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <form className="space-y-16" onSubmit={handleSubmit(onSubmit)}>
            <section className="space-y-8">
              <RecipeTitleInput
                value={formData.title}
                onChange={(value) =>
                  setValue('title', value, { shouldValidate: true })
                }
                error={errors.title?.message as string | undefined}
              />
              <RecipeDescriptionInput
                value={formData.description}
                onChange={(value) =>
                  setValue('description', value, { shouldValidate: true })
                }
              />
              <div className="flex flex-col gap-2">
                <label
                  className={cn(
                    'text-xs font-semibold uppercase tracking-[0.1em]',
                    'text-stone-500 dark:text-stone-400',
                  )}
                >
                  {t('pages.editor.fields.author.label')}
                </label>
                <Input
                  className={cn(
                    'bg-transparent border-b border-stone-300 dark:border-stone-700',
                    'focus:border-orange-700 dark:focus:border-orange-500',
                    'text-base py-4 outline-none',
                    'placeholder:text-stone-300 dark:placeholder:text-stone-600',
                    'text-stone-900 dark:text-stone-100',
                  )}
                  placeholder={t('pages.editor.fields.author.placeholder')}
                  {...register('author')}
                />
              </div>
            </section>

            <section>
              <label
                className={cn(
                  'text-xs font-semibold uppercase tracking-[0.1em] mb-3 block',
                  'text-stone-500 dark:text-stone-400',
                )}
              >
                {t('pages.editor.sections.image.header')}
              </label>
              <RecipeImageUpload
                thumbnailFile={formData.headerImgFile}
                thumbnailUrl={formData.headerImgUrl}
                onChange={handleHeaderImageChange}
                recommendation={t('pages.editor.sections.image.headerRecommendation')}
                aspectRatio={1500 / 1024}
              />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <IngredientSelector
                ingredients={formData.ingredients}
                onChange={(ingredients) =>
                  setValue('ingredients', ingredients, { shouldValidate: true })
                }
              />
              <KitchenwareSelector
                kitchenware={formData.kitchenware}
                onChange={(kitchenware) =>
                  setValue('kitchenware', kitchenware, { shouldValidate: true })
                }
              />
            </section>

            <PreparationSteps
              steps={formData.steps}
              onChange={(steps) =>
                setValue('steps', steps, { shouldValidate: true })
              }
            />

            <footer className="flex justify-between gap-6 pt-12">
              <div>
                {isEditing && initialData && (
                  <Button
                    type="button"
                    variant="outline"
                    className="px-6 py-4 border-stone-300 dark:border-stone-700"
                    onClick={() =>
                      router.navigate({
                        to: '/recipe/$id',
                        params: { id: initialData.id },
                      })
                    }
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t('pages.editor.actions.preview')}
                  </Button>
                )}
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="px-8 py-4 border-stone-300 dark:border-stone-700"
                  onClick={handleDiscard}
                >
                  {t('pages.editor.actions.discard')}
                </Button>
                <Button
                  type="submit"
                  className="px-12 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('common.saving')
                    : isEditing
                      ? t('pages.editor.actions.update')
                      : t('pages.editor.actions.publish')}
                </Button>
              </div>
            </footer>
          </form>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <RecipeImageUpload
              thumbnailFile={formData.thumbnailFile}
              thumbnailUrl={formData.thumbnailUrl}
              onChange={handleImageChange}
            />
            <RecipeMetadata
              time={formData.time}
              difficulty={formData.difficulty}
              portions={formData.portions}
              onTimeChange={(time) => setValue('time', time)}
              onDifficultyChange={(difficulty) =>
                setValue('difficulty', difficulty)
              }
              onPortionsChange={(portions) => setValue('portions', portions)}
            />
            <CategorySelector
              categories={formData.categories}
              onChange={(categories) =>
                setValue('categories', categories, { shouldValidate: true })
              }
              error={errors.categories?.message as string | undefined}
            />
            <EditorialTip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeEditorForm;
