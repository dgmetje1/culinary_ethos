import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetKitchenware } from '@/queries/kitchenware';
import i18n from '@/i18n';
import { Language } from '@/types/user';
import { Tool } from '@/types/kitchenware';

interface RecipeKitchenware {
  kitchenwareId: string;
  quantity: number;
  name: string;
}

interface KitchenwareSelectorProps {
  kitchenware: RecipeKitchenware[];
  onChange: (kitchenware: RecipeKitchenware[]) => void;
}

const KitchenwareSelector = ({ kitchenware, onChange }: KitchenwareSelectorProps) => {
  const { t } = useTranslation();
  const { data: kitchenwareData = [] } = useGetKitchenware();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedKitchenwareId, setSelectedKitchenwareId] = useState('');

  const currentLang = i18n.language as Language;

  const filteredKitchenware = useMemo(() => {
    const list = searchTerm
      ? kitchenwareData.filter((tool: Tool) => {
          const name = tool.content[currentLang]?.name?.toLowerCase() || '';
          return name.includes(searchTerm.toLowerCase());
        })
      : kitchenwareData;
    return list.slice(0, 10);
  }, [kitchenwareData, searchTerm, currentLang]);

  const handleAddKitchenware = () => {
    if (!selectedKitchenwareId) return;

    const tool = kitchenwareData.find((t: Tool) => t.id === selectedKitchenwareId);
    if (!tool) return;

    onChange([
      ...kitchenware,
      {
        kitchenwareId: selectedKitchenwareId,
        quantity: 1,
        name: tool.content[currentLang]?.name || selectedKitchenwareId,
      },
    ]);

    setSelectedKitchenwareId('');
    setSearchTerm('');
    setIsAdding(false);
  };

  const handleRemoveKitchenware = (kitchenwareId: string) => {
    onChange(kitchenware.filter((k) => k.kitchenwareId !== kitchenwareId));
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
          <span className="text-orange-600">🍳</span>
          {t('pages.editor.sections.tools.title')}
        </h3>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 h-8 px-3"
            onClick={() => setIsAdding(true)}
            type="button"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span className="text-xs">{t('pages.editor.add')}</span>
          </Button>
        )}
      </div>

      {kitchenware.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {kitchenware.map((tool) => (
            <span
              key={tool.kitchenwareId}
              className={cn(
                'inline-flex items-center gap-1.5',
                'px-3 py-1.5 rounded-full',
                'text-xs font-medium',
                'bg-orange-100 dark:bg-orange-900/30',
                'text-orange-800 dark:text-orange-200',
                'border border-orange-200/50 dark:border-orange-800/50'
              )}
            >
              {tool.name}
              <button
                className="text-orange-400 hover:text-red-500 transition-colors ml-1"
                onClick={() => handleRemoveKitchenware(tool.kitchenwareId)}
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : !isAdding ? (
        <p className="text-sm text-stone-400 italic py-4 text-center">
          {t('pages.editor.sections.tools.empty')}
        </p>
      ) : null}

      {isAdding && (
        <div className="mt-4 p-4 bg-stone-100/50 dark:bg-stone-800/30 rounded-lg space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              className="pl-10 bg-white dark:bg-stone-900"
              placeholder={t('pages.editor.sections.tools.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && filteredKitchenware.length > 0 && (
            <div className="max-h-32 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-lg">
              {filteredKitchenware.map((tool: Tool) => (
                <button
                  key={tool.id}
                  className="w-full text-left px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-sm text-stone-900 dark:text-stone-100"
                  onClick={() => {
                    setSelectedKitchenwareId(tool.id);
                    setSearchTerm(tool.content[currentLang]?.name || '');
                  }}
                  type="button"
                >
                  {tool.content[currentLang]?.name}
                </button>
              ))}
            </div>
          )}

          {selectedKitchenwareId && (
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddKitchenware} type="button">
                {t('pages.editor.add')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)} type="button">
                {t('pages.editor.cancel')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenwareSelector;