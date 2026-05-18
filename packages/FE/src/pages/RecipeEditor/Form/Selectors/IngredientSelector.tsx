import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetIngredients } from '@/queries/ingredients';
import { useGetUnits } from '@/queries/units';
import i18n from '@/i18n';
import { Language } from '@/types/user';
import { Ingredient } from '@/types/ingredients';
import { Unit } from '@/types/unit';

interface RecipeIngredient {
  ingredientId: string;
  unitId: string | null;
  quantity: number;
  isOptional: boolean;
  name: string;
}

interface IngredientSelectorProps {
  ingredients: RecipeIngredient[];
  onChange: (ingredients: RecipeIngredient[]) => void;
}

const IngredientSelector = ({ ingredients, onChange }: IngredientSelectorProps) => {
  const { t } = useTranslation();
  const { data: ingredientsData = [] } = useGetIngredients();
  const { data: unitsData = [] } = useGetUnits();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isOptional, setIsOptional] = useState(false);

  const currentLang = i18n.language as Language;

  const filteredIngredients = useMemo(() => {
    const list = searchTerm
      ? ingredientsData.filter((ing: Ingredient) => {
          const name = ing.content[currentLang]?.name?.toLowerCase() || '';
          return name.includes(searchTerm.toLowerCase());
        })
      : ingredientsData;
    return list.slice(0, 10);
  }, [ingredientsData, searchTerm, currentLang]);

  const visibleUnits = useMemo(() => {
    return unitsData.filter((unit: Unit) => unit.isVisible);
  }, [unitsData]);

  const handleAddIngredient = () => {
    if (!selectedIngredientId) return;

    const ingredient = ingredientsData.find((ing: Ingredient) => ing.id === selectedIngredientId);
    if (!ingredient) return;

    onChange([
      ...ingredients,
      {
        ingredientId: selectedIngredientId,
        unitId: selectedUnitId || null,
        quantity,
        isOptional,
        name: ingredient.content[currentLang]?.name || selectedIngredientId,
      },
    ]);

    setSelectedIngredientId('');
    setSelectedUnitId('');
    setQuantity(1);
    setIsOptional(false);
    setSearchTerm('');
    setIsAdding(false);
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    onChange(ingredients.filter((ing) => ing.ingredientId !== ingredientId));
  };

  const getUnitName = (unitId: string | null) => {
    if (!unitId) return '';
    const unit = unitsData.find((u: Unit) => u.id === unitId);
    return unit?.content[currentLang]?.shortName || '';
  };

  return (
    <div
      className={cn(
        'bg-white/60 dark:bg-stone-900/60',
        'backdrop-blur-xl',
        'border border-stone-200/30 dark:border-stone-800/30',
        'p-6 rounded-xl'
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className={cn(
            'text-lg font-serif font-medium',
            'text-stone-900 dark:text-stone-100',
            'flex items-center gap-2'
          )}
        >
          <span className="text-orange-600">🥗</span>
          {t('pages.editor.sections.ingredients.title')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 h-8 px-3"
          onClick={() => setIsAdding(!isAdding)}
          type="button"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span className="text-xs">{t('pages.editor.add')}</span>
        </Button>
      </div>

      {ingredients.length > 0 ? (
        <ul className="space-y-2">
          {ingredients.map((ing) => (
            <li
              key={ing.ingredientId}
              className={cn(
                'flex items-center justify-between',
                'px-4 py-3 rounded-lg',
                'bg-stone-50/80 dark:bg-stone-800/50',
                'border border-stone-200/50 dark:border-stone-700/50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-900 dark:text-stone-100 min-w-[60px]">
                  {ing.quantity} {getUnitName(ing.unitId)}
                </span>
                <span className="text-stone-700 dark:text-stone-300">
                  {ing.name}
                </span>
                {ing.isOptional && (
                  <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500 bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded">
                    {t('pages.editor.optional')}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-stone-400 hover:text-red-500 h-6 w-6 p-0"
                onClick={() => handleRemoveIngredient(ing.ingredientId)}
                type="button"
              >
                <X className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-400 italic py-4 text-center">
          {t('pages.editor.sections.ingredients.empty')}
        </p>
      )}

      {isAdding && (
        <div className="mt-4 p-4 bg-stone-100/50 dark:bg-stone-800/30 rounded-lg space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              className="pl-10 bg-white dark:bg-stone-900"
              placeholder={t('pages.editor.sections.ingredients.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && filteredIngredients.length > 0 && (
            <div className="max-h-32 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-lg">
              {filteredIngredients.map((ing: Ingredient) => (
                <button
                  key={ing.id}
                  className="w-full text-left px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-sm text-stone-900 dark:text-stone-100"
                  onClick={() => {
                    setSelectedIngredientId(ing.id);
                    setSearchTerm(ing.content[currentLang]?.name || '');
                  }}
                  type="button"
                >
                  {ing.content[currentLang]?.name}
                </button>
              ))}
            </div>
          )}

          {selectedIngredientId && (
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                type="number"
                className="w-20 h-9 bg-white dark:bg-stone-900"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                placeholder={t('pages.editor.quantity')}
              />
              <select
                className="flex-1 h-9 min-w-[120px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2 text-sm text-stone-900 dark:text-stone-100"
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
              >
                <option value="">{t('pages.editor.no_unit')}</option>
                {visibleUnits.map((unit: Unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.content[currentLang]?.shortName} - {unit.content[currentLang]?.name}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={isOptional}
                  onChange={(e) => setIsOptional(e.target.checked)}
                  className="rounded border-stone-300"
                />
                {t('pages.editor.optional')}
              </label>
              <Button
                size="sm"
                className="h-9"
                onClick={handleAddIngredient}
                type="button"
              >
                {t('pages.editor.add')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientSelector;