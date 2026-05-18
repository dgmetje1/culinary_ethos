import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  name: string;
}

interface ToolsSectionProps {
  tools: Tool[];
  onChange: (tools: Tool[]) => void;
}

const ToolsSection = ({ tools, onChange }: ToolsSectionProps) => {
  const { t } = useTranslation();
  const [newTool, setNewTool] = useState('');

  const handleAddTool = () => {
    if (newTool.trim()) {
      onChange([...tools, { id: Date.now().toString(), name: newTool.trim() }]);
      setNewTool('');
    }
  };

  const handleRemoveTool = (id: string) => {
    onChange(tools.filter((tool) => tool.id !== id));
  };

  return (
    <div
      className={cn(
        'bg-white/60 dark:bg-stone-900/60',
        'backdrop-blur-xl',
        'border border-stone-200/30 dark:border-stone-800/30',
        'p-8 rounded-lg'
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          className={cn(
            'text-xl font-serif',
            'text-stone-900 dark:text-stone-100',
            'flex items-center gap-2'
          )}
        >
          <span className="text-orange-700 dark:text-orange-500">🍳</span>
          {t('pages.editor.sections.tools.title')}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {tools.map((tool) => (
          <span
            key={tool.id}
            className={cn(
              'bg-white/80 dark:bg-stone-800/80',
              'backdrop-blur-md',
              'px-4 py-2 rounded-full',
              'text-xs font-semibold uppercase tracking-tight',
              'text-stone-900 dark:text-stone-100',
              'border border-stone-200/30 dark:border-stone-700/30',
              'flex items-center gap-2'
            )}
          >
            {tool.name.toUpperCase()}
            <button
              className="text-stone-400 hover:text-red-500 transition-colors"
              onClick={() => handleRemoveTool(tool.id)}
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          className={cn(
            'bg-transparent border-b border-stone-300 dark:border-stone-700',
            'focus:border-orange-700 dark:focus:border-orange-500',
            'text-sm py-2 outline-none',
            'placeholder:text-stone-300 dark:placeholder:text-stone-600'
          )}
          placeholder={t('pages.editor.sections.tools.add_placeholder')}
          value={newTool}
          onChange={(e) => setNewTool(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTool()}
        />
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-700 hover:text-orange-900 dark:text-orange-500 dark:hover:text-orange-400"
          onClick={handleAddTool}
          type="button"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ToolsSection;