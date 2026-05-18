import { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
  ];

  return (
    <div className={cn('rich-text-editor', className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={cn(
          '[&_.ql-container]:min-h-[150px]',
          '[&_.ql-editor]:min-h-[150px]',
          '[&_.ql-editor]:text-stone-900 dark:[&_.ql-editor]:text-stone-100',
          '[&_.ql-editor]:text-base',
          '[&_.ql-editor]:leading-relaxed',
          '[&_.ql-toolbar]:border-stone-200 dark:[&_.ql-toolbar]:border-stone-700',
          '[&_.ql-toolbar]:bg-stone-50 dark:[&_.ql-toolbar]:bg-stone-800',
          '[&_.ql-container]:border-stone-200 dark:[&_.ql-container]:border-stone-700',
          '[&_.ql-stroke]:stroke-stone-600 dark:[&_.ql-stroke]:stroke-stone-400',
          '[&_.ql-fill]:fill-stone-600 dark:[&_.ql-fill]:fill-stone-400',
          '[&_.ql-picker-label]:text-stone-600 dark:[&_.ql-picker-label]:text-stone-400',
          '[&_.ql-picker-options]:bg-white dark:[&_.ql-picker-options]:bg-stone-800',
          '[&_.ql-picker-options]:border-stone-200 dark:[&_.ql-picker-options]:border-stone-700',
          '[&_.ql-picker-item]:text-stone-600 dark:[&_.ql-picker-item]:text-stone-400',
          '[&_.ql-picker-item:hover]:text-orange-600',
          '[&_.ql-editor.ql-blank::before]:text-stone-300 dark:[&_.ql-editor.ql-blank::before]:text-stone-600',
          '[&_.ql-editor.ql-blank::before]:italic',
        )}
      />
    </div>
  );
};

export default RichTextEditor;