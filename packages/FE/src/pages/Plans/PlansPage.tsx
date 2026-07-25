import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus, ChevronLeft, ChevronRight, ShoppingBag, UtensilsCrossed, Bookmark, Copy, Share2, Check, X, CalendarDays, GripVertical } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useGetRecipes } from "@/queries/recipes";
import { getRecipe } from "@/queries/recipes/queries";
import { getMealPlanByWeek } from "@/queries/meal-plans/queries";
import { useGetMealPlanByWeek, useCreateMealPlan, useUpdateMealPlan } from "@/queries/meal-plans";
import { toast } from "sonner";
import config from "@/config";
import { composeCdnUrl } from "@/lib/utils";
import { RecipeListItem, Recipe } from "@/types/recipe";
import { MealPlanEntry } from "@/types/mealPlan";

const DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const MEAL_TYPES = [
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "brunch", label: "Brunch" },
];

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatWeekRange(monday: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const start = monday.toLocaleDateString("en-US", options);
  const end = new Date(monday);
  end.setDate(end.getDate() + 6);
  const endStr = end.getDate();
  return `${start} — ${endStr}`;
}

function getDayDate(monday: Date, dayIndex: number): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + dayIndex);
  return d;
}

interface AddMealDialogProps {
  open: boolean;
  recipes: RecipeListItem[];
  onSelect: (recipe: RecipeListItem, mealType: string) => void;
  onClose: () => void;
  defaultMealType?: string;
  usedRecipeIds?: Set<string>;
}

const AddMealDialog = ({ open, recipes, onSelect, onClose, defaultMealType, usedRecipeIds }: AddMealDialogProps) => {
  const [selectedMeal, setSelectedMeal] = useState(defaultMealType || MEAL_TYPES[0].key);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) &&
          !usedRecipeIds?.has(r.id),
      ),
    [recipes, search, usedRecipeIds],
  );

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedMeal(defaultMealType || MEAL_TYPES[0].key);
    }
  }, [open, defaultMealType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xl font-serif font-medium text-stone-900">Add to Planner</h2>
          <div className="flex gap-2 mt-4">
            {MEAL_TYPES.map((mt) => (
              <button
                key={mt.key}
                onClick={() => setSelectedMeal(mt.key)}
                className={`px-3 py-1 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors ${
                  selectedMeal === mt.key
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
              >
                {mt.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-stone-400 bg-stone-50"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-stone-400 py-8 text-sm">No recipes found</p>
          ) : (
            filtered.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => onSelect(recipe, selectedMeal)}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors text-left"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                  {recipe.thumbnailUrl ? (
                    <img src={composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">{recipe.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {recipe.time} min
                    {recipe.categories?.length > 0 && ` • ${recipe.categories.map((c) => c.name).join(", ")}`}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface MealSlotProps {
  entries: MealPlanEntry[];
  onAdd: () => void;
  onRemove?: (entryId: string) => void;
  onEditPortions?: (entry: MealPlanEntry) => void;
  mealType: string;
  mealTypeKey: string;
  day: number;
  onDropRecipe?: (recipeId: string, recipeTitle: string, recipeImageUrl: string | undefined, mealType: string, day: number, portions?: number) => void;
}

const MealSlot = ({ entries, onAdd, onRemove, onEditPortions, mealType, mealTypeKey, day, onDropRecipe }: MealSlotProps) => {
  const hasEntries = entries.length > 0;
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const recipeData = e.dataTransfer.getData('application/x-recipe');
    if (recipeData && onDropRecipe) {
      const recipe = JSON.parse(recipeData);
      onDropRecipe(recipe.id, recipe.title, recipe.imageUrl, mealTypeKey, day, recipe.portions);
    }
  };

  return (
    <div
      className={`rounded-xl min-h-[72px] transition-colors ${isDragOver ? 'bg-stone-100/80 ring-2 ring-stone-400 ring-dashed' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
          {mealType}
        </span>
        <button
          onClick={onAdd}
          className="p-1 rounded-md hover:bg-stone-200/70 transition-colors text-stone-400 hover:text-stone-600"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="relative">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="relative bg-white border border-stone-200 rounded-md shadow-sm px-4 py-3 group hover:shadow-md hover:border-stone-300 transition-all"
            style={{
              marginBottom: index < entries.length - 1 ? '-0.375rem' : '0',
              zIndex: hoveredIndex === index ? 9999 : entries.length - index,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {onEditPortions && (
              <button
                onClick={() => onEditPortions(entry)}
                className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 text-[10px] font-medium text-white bg-stone-500 hover:bg-stone-700 rounded-full w-5 h-5 flex items-center justify-center shadow-sm transition-all z-10"
                title="Adjust portions"
              >
                {entry.portions || 4}
              </button>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[15px] text-stone-900 leading-snug font-medium break-words flex-1 min-w-0">
                {entry.recipeTitle}
              </span>
              {onRemove && (
                <button
                  onClick={() => onRemove(entry.id)}
                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-all text-xs flex-shrink-0"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        {!hasEntries && (
          <button
            onClick={onAdd}
            className="w-full border-2 border-dashed border-stone-200/50 rounded-lg flex items-center justify-center py-5 hover:border-secondary/50 transition-colors text-stone-400 hover:text-stone-600"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

interface AggregatedIngredient {
  compoundKey: string;
  id: string;
  name: string;
  singularName: string;
  quantity: number;
  unit: string;
  recipes: string[];
}

function aggregateIngredients(entries: MealPlanEntry[], recipes: Recipe[]): AggregatedIngredient[] {
  const recipeMap = new Map(recipes.map((r) => [r.id, r]));
  const map = new Map<string, AggregatedIngredient>();

  for (const entry of entries) {
    const recipe = recipeMap.get(entry.recipeId);
    if (!recipe) continue;

    const recipePortions = Math.max(recipe.portions || 1, 1);
    const port = entry.portions ?? recipePortions;
    const scale = port / recipePortions;

    for (const ing of recipe.ingredients) {
      const compoundKey = `${ing.id}-${ing.unit?.name || 'unit'}`;
      const existing = map.get(compoundKey);
      const scaledQty = Math.round(ing.quantity * scale * 100) / 100;

      if (existing) {
        existing.quantity += scaledQty;
        if (!existing.recipes.includes(recipe.title)) {
          existing.recipes.push(recipe.title);
        }
      } else {
        map.set(compoundKey, {
          compoundKey,
          id: ing.id,
          name: ing.name,
          singularName: ing.singularName,
          quantity: scaledQty,
          unit: ing.unit?.name || '',
          recipes: [recipe.title],
        });
      }
    }
  }
  return Array.from(map.values());
}

const FRACTIONS: [number, string][] = [
  [1/8, '⅛'], [1/4, '¼'], [1/3, '⅓'], [3/8, '⅜'],
  [1/2, '½'], [5/8, '⅝'], [2/3, '⅔'], [3/4, '¾'], [7/8, '⅞'],
];

function toFraction(value: number): string {
  const int = Math.floor(value);
  const frac = Math.round((value - int) * 1000) / 1000;
  if (frac === 0) return `${int}`;
  if (int === 0) {
    const match = FRACTIONS.find(([d]) => Math.abs(frac - d) < 0.001);
    if (match) return match[1];
    return `${Math.round(frac * 100) / 100}`;
  }
  const match = FRACTIONS.find(([d]) => Math.abs(frac - d) < 0.001);
  return match ? `${int} ${match[1]}` : `${int + frac}`;
}

function formatQuantity(value: number, name: string, singularName: string): string {
  const n = Math.round(value * 100) / 100;
  const label = n === 1 ? singularName || name : name;
  const display = n < 10 && n !== Math.round(n) ? toFraction(n) : `${n}`;
  return `${display} ${label}`;
}

interface ShoppingListDialogProps {
  open: boolean;
  onClose: () => void;
  entries: MealPlanEntry[];
  weekLabel: string;
  ingredients: AggregatedIngredient[];
  recipes: Recipe[];
  loading: boolean;
}

const ShoppingListDialog = ({ open, onClose, entries, weekLabel, ingredients, recipes, loading }: ShoppingListDialogProps) => {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const checkedCount = checked.size;
  const totalCount = ingredients.length;
  const progress = totalCount > 0 ? checkedCount / totalCount : 0;

  const toggleCheck = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearChecked = () => setChecked(new Set());
  const checkAll = () => setChecked(new Set(ingredients.map((i) => i.compoundKey)));

  const buildText = useCallback(() => {
    const lines = [`Shopping List — ${weekLabel}`, ''];
    for (const ing of ingredients) {
      const done = checked.has(ing.compoundKey) ? '[✓]' : '[ ]';
      const qty = formatQuantity(ing.quantity, ing.name, ing.singularName);
      lines.push(`${done} ${qty}${ing.unit ? ` ${ing.unit}` : ''}`);
    }
    return lines.join('\n');
  }, [ingredients, checked, weekLabel]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Shopping List — ${weekLabel}`,
        text: buildText(),
      });
    } else {
      handleCopy();
    }
  };

  useEffect(() => {
    if (open) {
      setChecked(new Set());
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm pt-4 sm:pt-16 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg max-h-[85vh] flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900 leading-tight">Shopping List</h2>
              <p className="text-xs text-stone-400 leading-tight">{weekLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600 relative"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recipes list */}
        {recipes.length > 0 && (
          <div className="px-6 py-3 border-b border-stone-50 shrink-0">
            <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider mb-2">From</p>
            <div className="flex flex-wrap gap-1.5">
              {recipes.map((r) => (
                <span key={r.id} className="text-[11px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md font-medium">
                  {r.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="px-6 pt-4 pb-2 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-stone-500">
                {checkedCount}/{totalCount} items
              </span>
              {checkedCount > 0 && (
                <button
                  onClick={clearChecked}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Clear all
                </button>
              )}
              {checkedCount === 0 && (
                <button
                  onClick={checkAll}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  Select all
                </button>
              )}
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Ingredients */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-stone-100 shrink-0" />
                  <div className="h-4 bg-stone-100 rounded" style={{ width: `${50 + i * 10}%` }} />
                </div>
              ))}
            </div>
          ) : ingredients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <ShoppingBag className="w-8 h-8 mb-3 text-stone-300" />
              <p className="text-sm font-medium">No ingredients yet</p>
              <p className="text-xs mt-0.5">Add recipes to your meal plan to get started.</p>
            </div>
          ) : (
            <div className="space-y-0.5 py-1">
              {ingredients.map((ing) => {
                const isChecked = checked.has(ing.compoundKey);
                return (
                  <label
                    key={ing.compoundKey}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none group ${
                      isChecked ? 'bg-stone-50' : 'hover:bg-stone-50 active:bg-stone-100'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        isChecked
                          ? 'bg-stone-900 border-stone-900'
                          : 'border-stone-300 group-hover:border-stone-400'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={`text-sm flex-1 transition-all ${
                        isChecked ? 'text-stone-400 line-through' : 'text-stone-800'
                      }`}
                    >
                      {formatQuantity(ing.quantity, ing.name, ing.singularName)}
                      {ing.unit ? ` ${ing.unit}` : ''}
                    </span>
                    {ing.recipes.length > 1 && (
                      <span className="text-[10px] text-stone-400 shrink-0 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
                        ×{ing.recipes.length}
                      </span>
                    )}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheck(ing.compoundKey)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 shrink-0 flex items-center justify-between">
          <span className="text-xs text-stone-400">{ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-lg text-xs h-8 border-stone-200 text-stone-600"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              size="sm"
              onClick={handleShare}
              className="rounded-lg text-xs h-8 bg-stone-900 text-white hover:bg-stone-800"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PortionsDialogProps {
  entry: MealPlanEntry | null;
  onSave: (entryId: string, portions: number) => void;
  onClose: () => void;
}

const PortionsDialog = ({ entry, onSave, onClose }: PortionsDialogProps) => {
  const [portions, setPortions] = useState(entry?.portions || 4);
  const open = entry !== null;

  useEffect(() => {
    if (entry) setPortions(entry.portions || 4);
  }, [entry]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-xs p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-serif font-medium text-stone-900 mb-1">{entry.recipeTitle}</h3>
        <p className="text-xs text-stone-400 mb-5">Adjust servings</p>

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setPortions(Math.max(1, portions - 1))}
            className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:border-stone-300 transition-all text-lg font-medium"
          >
            −
          </button>
          <span className="text-3xl font-serif font-medium text-stone-900 tabular-nums min-w-[2ch] text-center">
            {portions}
          </span>
          <button
            onClick={() => setPortions(portions + 1)}
            className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 hover:border-stone-300 transition-all text-lg font-medium"
          >
            +
          </button>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl text-xs border-stone-200"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1 rounded-xl text-xs bg-stone-900 text-white hover:bg-stone-800"
            onClick={() => { onSave(entry.id, portions); onClose(); }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

type CopyDayFn = (source: number, targetDateStr: string) => void;

const CopyDayButton = ({ dayIndex, hasEntries, onCopy }: { dayIndex: number; hasEntries: boolean; onCopy: CopyDayFn }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const sourceLabel = DAYS_OF_WEEK[dayIndex].charAt(0).toUpperCase() + DAYS_OF_WEEK[dayIndex].slice(1);

  const handleCopy = () => {
    if (selectedDate) {
      onCopy(dayIndex, formatDate(selectedDate));
      setOpen(false);
      setSelectedDate(undefined);
    }
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSelectedDate(undefined); }}>
      <PopoverTrigger asChild>
        <button
          className={`p-1 rounded transition-colors ${
            hasEntries ? 'text-stone-400 hover:text-stone-600 hover:bg-stone-100' : 'text-stone-200 cursor-not-allowed'
          }`}
          disabled={!hasEntries}
          title="Copy this day to a date"
        >
          <Copy className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" side="bottom" align="end">
        <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-widest">
          Copy {sourceLabel} to...
        </p>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
        />
        <Button
          size="sm"
          disabled={!selectedDate}
          className="w-full mt-3 rounded-xl text-xs bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleCopy}
        >
          <Copy className="w-3.5 h-3.5 mr-1.5" />
          Copy to {selectedDate ? format(selectedDate, "MMM d") : "..."}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const PlansPage = () => {
  const { t } = useTranslation();
  const [currentMonday, setCurrentMonday] = useState(() => getMondayOfWeek(new Date()));
  const [addingToDay, setAddingToDay] = useState<number | null>(null);
  const [addingMealType, setAddingMealType] = useState<string>(MEAL_TYPES[0].key);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [copyWeekDate, setCopyWeekDate] = useState("");
  const [editingPortionsEntry, setEditingPortionsEntry] = useState<MealPlanEntry | null>(null);

  const weekStart = formatDate(currentMonday);
  const weekRange = formatWeekRange(currentMonday);

  const { data: recipes = [] } = useGetRecipes({});
  const { data: mealPlan, refetch: refetchPlan } = useGetMealPlanByWeek(weekStart);
  const { mutateAsync: createPlan } = useCreateMealPlan();
  const { mutateAsync: updatePlan } = useUpdateMealPlan();

  const uniqueRecipeIds = useMemo(
    () => [...new Set((mealPlan?.entries || []).map((e) => e.recipeId))],
    [mealPlan],
  );

  const recipeResults = useQueries({
    queries: uniqueRecipeIds.map((id) => ({
      queryKey: ["recipes", "getRecipe", id],
      queryFn: () => getRecipe(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const fetchedRecipes = useMemo(
    () => recipeResults.map((r) => r.data).filter(Boolean) as Recipe[],
    [recipeResults],
  );

  const ingredients = useMemo(() => aggregateIngredients(mealPlan?.entries || [], fetchedRecipes), [mealPlan?.entries, fetchedRecipes]);
  const totalIngredients = ingredients.length;
  const ingredientsLoading = recipeResults.some((r) => r.isLoading);

  const entriesByDay = useMemo(() => {
    const map: Record<number, MealPlanEntry[]> = {};
    if (mealPlan?.entries) {
      mealPlan.entries.forEach((entry) => {
        if (!map[entry.day]) map[entry.day] = [];
        map[entry.day].push(entry);
      });
    }
    return map;
  }, [mealPlan]);

  const getEntriesForMeal = useCallback(
    (day: number, mealType: string): MealPlanEntry[] => {
      return entriesByDay[day]?.filter((e) => e.mealType === mealType) || [];
    },
    [entriesByDay],
  );

  const handleCopyDay = useCallback(async (sourceDay: number, targetDateStr: string) => {
    const sourceEntries = entriesByDay[sourceDay] || [];
    if (sourceEntries.length === 0) {
      toast.warning(t("plans.toast.nothingToCopy"), { description: t("plans.toast.nothingToCopyDayDesc") });
      return;
    }

    const targetDate = new Date(targetDateStr + "T00:00:00");
    const targetDay = (targetDate.getDay() + 6) % 7;
    const targetMonday = getMondayOfWeek(targetDate);
    const targetWeekStart = formatDate(targetMonday);
    const targetLabel = DAYS_OF_WEEK[targetDay].charAt(0).toUpperCase() + DAYS_OF_WEEK[targetDay].slice(1);

    const newEntries = sourceEntries.map((e) => ({
      ...e,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      day: targetDay,
    }));

    if (targetWeekStart === weekStart) {
      const currentEntries = mealPlan?.entries || [];
      const existingKeys = new Set(
        currentEntries.filter((e) => e.day === targetDay).map((e) => `${e.mealType}-${e.recipeId}`),
      );
      const filtered = newEntries.filter((e) => !existingKeys.has(`${e.mealType}-${e.recipeId}`));

      if (filtered.length === 0) {
        toast.warning(t("plans.toast.alreadyPlanned"), { description: t("plans.toast.alreadyPlannedTargetDesc") });
        return;
      }

      const updated = [...currentEntries, ...filtered];
      if (mealPlan?.id) {
        await updatePlan({ id: mealPlan.id, data: { entries: updated } });
      } else {
        await createPlan({ weekStart, entries: updated });
      }
      toast.success(t("plans.toast.dayCopied"), { description: t("plans.toast.dayCopiedDesc", { targetLabel }) });
    } else {
      const targetPlan = await getMealPlanByWeek(targetWeekStart);
      const existingKeys = new Set(
        (targetPlan?.entries || []).filter((e) => e.day === targetDay).map((e) => `${e.mealType}-${e.recipeId}`),
      );
      const filtered = newEntries.filter((e) => !existingKeys.has(`${e.mealType}-${e.recipeId}`));

      if (filtered.length === 0) {
        toast.warning(t("plans.toast.alreadyPlanned"), { description: t("plans.toast.alreadyPlannedTargetDesc") });
        return;
      }

      if (targetPlan && targetPlan.id) {
        await updatePlan({ id: targetPlan.id, data: { entries: [...targetPlan.entries, ...filtered] } });
      } else {
        await createPlan({ weekStart: targetWeekStart, entries: filtered });
      }
      toast.success(t("plans.toast.dayCopied"), { description: t("plans.toast.dayCopiedDescWithDate", { targetLabel, targetDateStr }) });
    }
  }, [entriesByDay, mealPlan, updatePlan, createPlan, weekStart, refetchPlan, t]);

  const handleCopyWeek = useCallback(async (targetDateStr: string) => {
    const currentEntries = mealPlan?.entries || [];
    if (currentEntries.length === 0) {
      toast.warning(t("plans.toast.nothingToCopy"), { description: t("plans.toast.nothingToCopyWeekDesc") });
      return;
    }

    const targetMonday = getMondayOfWeek(new Date(targetDateStr + "T00:00:00"));
    const targetWeekStart = formatDate(targetMonday);

    if (targetWeekStart === weekStart) {
      toast.warning(t("plans.toast.sameWeek"), { description: t("plans.toast.sameWeekDesc") });
      return;
    }

    const newEntries = currentEntries.map((e) => ({
      ...e,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }));

    const targetPlan = await getMealPlanByWeek(targetWeekStart);
    if (targetPlan && targetPlan.id) {
      const existingKeys = new Set(targetPlan.entries.map((e) => `${e.day}-${e.mealType}-${e.recipeId}`));
      const toAdd = newEntries.filter((e) => !existingKeys.has(`${e.day}-${e.mealType}-${e.recipeId}`));
      const merged = [...targetPlan.entries, ...toAdd];
      await updatePlan({ id: targetPlan.id, data: { entries: merged } });
    } else {
      await createPlan({ weekStart: targetWeekStart, entries: newEntries });
    }
    toast.success(t("plans.toast.weekCopied"), { description: t("plans.toast.weekCopiedDesc", { weekRange: formatWeekRange(targetMonday) }) });
  }, [mealPlan, weekStart, updatePlan, createPlan, t]);

  const goPreviousWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    setCurrentMonday(prev);
  };

  const goNextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    setCurrentMonday(next);
  };

  const handleDropRecipe = useCallback(async (recipeId: string, recipeTitle: string, recipeImageUrl: string | undefined, mealType: string, day: number, portions?: number) => {
    const currentEntries = mealPlan?.entries || [];

    if (currentEntries.some((e) => e.day === day && e.mealType === mealType && e.recipeId === recipeId)) {
      toast.warning(t("plans.toast.alreadyPlanned"), { description: t("plans.toast.alreadyPlannedSlotDesc", { recipeTitle }) });
      return;
    }

    const newEntry: MealPlanEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      day,
      mealType,
      recipeId,
      recipeTitle,
      recipeImageUrl,
      portions: portions ?? 4,
    };

    if (mealPlan?.id) {
      await updatePlan({
        id: mealPlan.id,
        data: { entries: [...currentEntries, newEntry] },
      });
    } else {
      await createPlan({
        weekStart,
        entries: [newEntry],
      });
    }

    toast.success(t("plans.toast.recipeAdded"), { description: t("plans.toast.recipeAddedDesc", { recipeTitle, mealType: t(`plans.mealTypes.${mealType}`, mealType) }) });
  }, [mealPlan, updatePlan, createPlan, weekStart, t]);

  const handleAddMeal = (day: number, mealType: string) => {
    setAddingToDay(day);
    setAddingMealType(mealType);
    setDialogOpen(true);
  };

  const handleEditPortions = useCallback((entry: MealPlanEntry) => {
    setEditingPortionsEntry(entry);
  }, []);

  const handleSavePortions = useCallback(async (entryId: string, portions: number) => {
    if (!mealPlan?.id) return;
    const updated = (mealPlan.entries || []).map((e) =>
      e.id === entryId ? { ...e, portions } : e,
    );
    await updatePlan({ id: mealPlan.id, data: { entries: updated } });
  }, [mealPlan, updatePlan, refetchPlan]);

  const handleSelectRecipe = async (recipe: RecipeListItem, mealType: string) => {
    const currentEntries = mealPlan?.entries || [];

    if (currentEntries.some((e) => e.day === addingToDay && e.mealType === mealType && e.recipeId === recipe.id)) {
      return;
    }

    const newEntry: MealPlanEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      day: addingToDay!,
      mealType,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      recipeImageUrl: recipe.thumbnailUrl || undefined,
      portions: recipe.portions || 4,
    };

    if (mealPlan?.id) {
      await updatePlan({
        id: mealPlan.id,
        data: { entries: [...currentEntries, newEntry] },
      });
    } else {
      await createPlan({
        weekStart,
        entries: [newEntry],
      });
    }

    setDialogOpen(false);
    setAddingToDay(null);
  };

  const handleRemoveMeal = async (entryId: string) => {
    if (!mealPlan?.id) return;
    const updated = (mealPlan.entries || []).filter((e) => e.id !== entryId);
    await updatePlan({
      id: mealPlan.id,
      data: { entries: updated },
    });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="flex max-w-[1440px] mx-auto">
        {/* Sidebar - Favorites */}
        <aside className="hidden lg:flex flex-col w-80 bg-[#F5F5F4]/70 backdrop-blur-sm border-r border-stone-200 h-[calc(100vh-80px)] sticky top-20 overflow-y-auto hide-scrollbar">
          <div className="px-8 py-10">
            <h2 className="text-[24px] font-serif font-medium mb-6 text-stone-900">
              {t("plans.favorites", "My Favorites")}
            </h2>
            <p className="text-xs text-stone-400 mb-6 -mt-4">
              Drag recipes onto days in the planner
            </p>
            <div className="space-y-8">
              {recipes.slice(0, 5).map((recipe) => (
                <div
                  key={recipe.id}
                  className="group cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/x-recipe', JSON.stringify({
                      id: recipe.id,
                      title: recipe.title,
                      imageUrl: recipe.thumbnailUrl || undefined,
                      portions: recipe.portions || 4,
                    }));
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                >
                  <div className="relative mb-3 overflow-hidden rounded-xl">
                    {recipe.thumbnailUrl ? (
                      <img
                        src={composeCdnUrl(config.cdnUrl, recipe.thumbnailUrl)}
                        alt=""
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-32 bg-stone-100 flex items-center justify-center text-stone-300">
                        <UtensilsCrossed className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 p-1 bg-white/80 backdrop-blur-sm rounded-full transition-opacity">
                      <GripVertical className="w-3.5 h-3.5 text-stone-600" />
                    </div>
                    <div className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full">
                      <Bookmark className="w-3.5 h-3.5 text-stone-600" />
                    </div>
                  </div>
                  <h3 className="text-base text-stone-900">{recipe.title}</h3>
                  <p className="text-[11px] font-semibold text-stone-500 mt-1 uppercase tracking-widest">
                    {recipe.time} MIN
                    {recipe.categories?.length > 0 &&
                      ` • ${recipe.categories.map((c) => c.name.toUpperCase()).join(", ")}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 px-8 py-10 lg:px-12">
          <div className="max-w-[1000px] mx-auto">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-[11px] font-semibold text-secondary uppercase tracking-[0.1em]">
                  {t("plans.weekly", "Weekly Planner")}
                </span>
                <h1 className="text-[32px] sm:text-[48px] font-serif leading-[1.1] tracking-tight mt-2 text-stone-900">
                  {weekRange}
                </h1>
              </div>
              <div className="flex items-center gap-2 self-end">
                <Popover onOpenChange={(open) => { if (open) setCopyWeekDate(""); }}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs uppercase tracking-widest font-semibold border-stone-200"
                    >
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy Week
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-4" side="bottom" align="end">
                    <p className="text-xs font-semibold text-stone-500 mb-3 uppercase tracking-widest">Copy week to...</p>
                    <select
                      value={copyWeekDate}
                      onChange={(e) => setCopyWeekDate(e.target.value)}
                      onFocus={() => {
                        if (!copyWeekDate) {
                          const next = new Date(currentMonday);
                          next.setDate(next.getDate() + 7);
                          setCopyWeekDate(formatDate(next));
                        }
                      }}
                      className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                    >
                      <option value="" disabled>Select a week...</option>
                      {[-4, -3, -2, -1, 1, 2, 3, 4].map((offset) => {
                        const d = new Date(currentMonday);
                        d.setDate(d.getDate() + offset * 7);
                        const val = formatDate(d);
                        const label = offset === -1 ? "Previous week" : offset === 1 ? "Next week" : `${Math.abs(offset)} weeks ${offset < 0 ? "ago" : "ahead"}`;
                        return (
                          <option key={val} value={val}>{label} — {formatWeekRange(d)}</option>
                        );
                      })}
                    </select>
                    <Button
                      size="sm"
                      disabled={!copyWeekDate}
                      className="w-full mt-2 rounded-xl text-xs bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => { if (copyWeekDate) { handleCopyWeek(copyWeekDate); setCopyWeekDate(""); } }}
                    >
                      <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                      Copy
                    </Button>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goPreviousWeek}
                  className="rounded-xl text-xs uppercase tracking-widest font-semibold border-stone-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t("plans.previous", "Previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goNextWeek}
                  className="rounded-xl text-xs uppercase tracking-widest font-semibold border-stone-200"
                >
                  {t("plans.next", "Next")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </header>

            {/* Calendar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
              {DAYS_OF_WEEK.map((dayName, dayIndex) => {
                const dayDate = getDayDate(currentMonday, dayIndex);
                return (
                  <div key={dayName} className="flex flex-col min-h-[300px] sm:min-h-[400px]">
                    <div className="mb-3 sm:mb-4 text-center pb-2 border-b border-stone-200 relative">
                      <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-widest">
                        {t(`plans.days.${dayName}`, dayName.charAt(0).toUpperCase() + dayName.slice(1, 3))}
                      </span>
                      <span className="text-[20px] sm:text-[24px] font-serif font-medium text-stone-900">
                        {dayDate.getDate()}
                      </span>
                      <CopyDayButton
                        dayIndex={dayIndex}
                        hasEntries={(entriesByDay[dayIndex]?.length ?? 0) > 0}
                        onCopy={handleCopyDay}
                      />
                    </div>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      {MEAL_TYPES.map((mt) => {
                        const entries = getEntriesForMeal(dayIndex, mt.key);
                        return (
                          <MealSlot
                            key={mt.key}
                            entries={entries}
                            mealType={t(`plans.mealTypes.${mt.key}`, mt.label)}
                            mealTypeKey={mt.key}
                            day={dayIndex}
                            onAdd={() => handleAddMeal(dayIndex, mt.key)}
                            onRemove={handleRemoveMeal}
                            onEditPortions={handleEditPortions}
                            onDropRecipe={handleDropRecipe}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shopping List Preview */}
            <div className="mt-20 p-8 bg-stone-100/50 backdrop-blur-sm rounded-xl border border-stone-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-[24px] font-serif font-medium text-stone-900">
                    {t("plans.shoppingList.title", "Shopping List")}
                  </h2>
                  <p className="text-base text-stone-500 mt-1">
                    {ingredientsLoading && mealPlan?.entries?.length
                      ? "Loading ingredients..."
                      : t("plans.shoppingList.ingredients", "{{count}} ingredients detected for this week.", {
                          count: totalIngredients,
                        })}
                  </p>
                </div>
                <Button
                  onClick={() => setShoppingListOpen(true)}
                  className="bg-stone-900 text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-stone-800 transition-colors rounded-xl"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t("plans.shoppingList.viewFull", "View Full List")}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-secondary/90">
          <UtensilsCrossed className="w-6 h-6" />
        </button>
      </div>

      {/* Shopping List Dialog */}
      <ShoppingListDialog
        open={shoppingListOpen}
        onClose={() => setShoppingListOpen(false)}
        entries={mealPlan?.entries || []}
        weekLabel={weekRange}
        ingredients={ingredients}
        recipes={fetchedRecipes}
        loading={ingredientsLoading}
      />

      {/* Portions Dialog */}
      <PortionsDialog
        entry={editingPortionsEntry}
        onSave={handleSavePortions}
        onClose={() => setEditingPortionsEntry(null)}
      />

      {/* Add Meal Dialog */}
      <AddMealDialog
        open={dialogOpen}
        recipes={recipes}
        onSelect={handleSelectRecipe}
        onClose={() => {
          setDialogOpen(false);
          setAddingToDay(null);
          setAddingMealType(MEAL_TYPES[0].key);
        }}
        defaultMealType={addingMealType}
        usedRecipeIds={
          addingToDay !== null
            ? new Set(
                (mealPlan?.entries || [])
                  .filter((e) => e.day === addingToDay && e.mealType === addingMealType)
                  .map((e) => e.recipeId),
              )
            : undefined
        }
      />
    </div>
  );
};

export default PlansPage;
