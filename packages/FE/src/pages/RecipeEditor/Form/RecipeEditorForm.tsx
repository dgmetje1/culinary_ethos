import { useTranslation } from 'react-i18next';
import { useForm, useStore } from '@tanstack/react-form';
import { z } from 'zod';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  title: z.string().min(1, i18n.t('pages.editor.validation.titleRequired')),
  description: z.string().optional(),
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
    .refine((val) => val.length > 0, {
      message: i18n.t('pages.editor.validation.categoriesMin'),
      path: ['categories'],
    }),
  steps: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      imageUrl: z.string().optional(),
      imageFile: z.instanceof(File).optional(),
    }),
  ),
  time: z.number().min(1, i18n.t('pages.editor.validation.timeMin')),
  difficulty: z.string(),
  portions: z.number().min(1, i18n.t('pages.editor.validation.portionsMin')),
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
        imageUrl: step.imageUrl,
      })),
    headerImg: data.headerImgUrl,
  };
};

const defaultValues: RecipeFormData = {
  title: '',
  description: '',
  ingredients: [],
  kitchenware: [],
  categories: [],
  steps: [
    {
      id: '1',
      title: '',
      description: '',
      imageUrl: undefined,
      imageFile: undefined,
    },
    {
      id: '2',
      title: '',
      description: '',
      imageUrl: undefined,
      imageFile: undefined,
    },
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
        imageUrl: (step as unknown as { imageUrl?: string }).imageUrl,
        imageFile: undefined,
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

  const form = useForm({
    defaultValues: initialData ? getInitialValues() : defaultValues,
    validators: {
      onSubmit: ({ value }: { value: RecipeFormData }) => {
        const result = recipeFormSchema.safeParse(value);
        if (result.success) return undefined;
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const path = issue.path.join('.');
          if (path && !fieldErrors[path]) {
            fieldErrors[path] = issue.message;
          }
        }
        return { fields: fieldErrors };
      },
    },
    onSubmit: async ({ value }) => {
      const data = value as unknown as RecipeFormData;
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

      const stepImageUrls: Record<string, string> = {};
      for (const step of data.steps) {
        if (step.imageFile) {
          try {
            const uploadResult = (await uploadFile.mutateAsync({
              file: step.imageFile,
              category: 'recipes',
            })) as UploadFileResponse;
            stepImageUrls[step.id] = uploadResult.relativePath;
          } catch (error) {
            console.error('Failed to upload step image:', error);
            return;
          }
        }
      }

      const dto = transformToCreateRecipeDto({
        ...data,
        thumbnailUrl,
        headerImgUrl,
        steps: data.steps.map((step) => ({
          ...step,
          imageUrl: step.imageUrl || stepImageUrls[step.id] || undefined,
        })),
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        }
      } catch (error) {
        toast.error(t('pages.editor.toast.error'));
      }
    },
  });

  const formData = useStore(
    form.store,
    (state) => state.values,
  ) as unknown as RecipeFormData;
  const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  const handleDiscard = () => {
    form.reset();
  };

  const handleImageChange = (file: File | undefined) => {
    form.setFieldValue('thumbnailFile', file);
  };

  const handleHeaderImageChange = (file: File | undefined) => {
    form.setFieldValue('headerImgFile', file);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <form
            className="space-y-16"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <section className="space-y-8">
              <RecipeTitleInput
                value={formData.title}
                onChange={(value) => form.setFieldValue('title', value)}
                error={
                  fieldMeta.title?.errors?.[0]?.message as string | undefined
                }
              />
              <RecipeDescriptionInput
                value={formData.description}
                onChange={(value) => form.setFieldValue('description', value)}
              />
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
                recommendation={t(
                  'pages.editor.sections.image.headerRecommendation',
                )}
                aspectRatio={1500 / 1024}
              />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <IngredientSelector
                ingredients={formData.ingredients}
                onChange={(ingredients) =>
                  form.setFieldValue('ingredients', ingredients)
                }
              />
              <KitchenwareSelector
                kitchenware={formData.kitchenware}
                onChange={(kitchenware) =>
                  form.setFieldValue('kitchenware', kitchenware)
                }
              />
            </section>
            <PreparationSteps
              steps={formData.steps}
              onChange={(steps) => form.setFieldValue('steps', steps)}
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
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      } as any)
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
              onTimeChange={(time) => form.setFieldValue('time', time)}
              onDifficultyChange={(difficulty) =>
                form.setFieldValue('difficulty', difficulty)
              }
              onPortionsChange={(portions) =>
                form.setFieldValue('portions', portions)
              }
              timeError={
                fieldMeta.time?.errors?.[0]?.message as string | undefined
              }
              portionsError={
                fieldMeta.portions?.errors?.[0]?.message as string | undefined
              }
            />
            <CategorySelector
              categories={formData.categories}
              onChange={(categories) =>
                form.setFieldValue('categories', categories)
              }
              error={
                fieldMeta.categories?.errors?.[0]?.message as string | undefined
              }
            />
            <EditorialTip />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeEditorForm;
