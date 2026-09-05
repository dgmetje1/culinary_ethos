import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { optimizeImage } from '@/lib/optimizeImage';
import { ImagePlus, Upload, X } from 'lucide-react';

import { cn, composeCdnUrl } from '@/lib/utils';
import config from '@/config';

interface RecipeImageUploadProps {
  thumbnailFile?: File;
  thumbnailUrl?: string;
  onChange: (file: File | undefined) => void;
  recommendation?: string;
  showRecommendation?: boolean;
  aspectRatio?: number;
}

const RecipeImageUpload = ({
  thumbnailFile,
  thumbnailUrl,
  onChange,
  recommendation,
  showRecommendation = true,
  aspectRatio = 4 / 5,
}: RecipeImageUploadProps) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (thumbnailUrl && !thumbnailFile) {
      setPreview(composeCdnUrl(config.cdnUrl, thumbnailUrl) ?? null);
    }
  }, [thumbnailUrl, thumbnailFile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const optimized = await optimizeImage(file).catch(() => file);
      onChange(optimized);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(optimized);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      className={cn(
        'relative group',
        'bg-stone-100 dark:bg-stone-900',
        'overflow-hidden rounded-xl',
        'border border-stone-300 dark:border-stone-700',
        'cursor-pointer shadow-lg',
      )}
      style={{ aspectRatio: aspectRatio }}
      onClick={handleClick}
    >
      <input
        accept="image/*"
        className="hidden"
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center p-8 text-center',
          'bg-black/30 group-hover:bg-black/50 transition-colors z-10',
          preview ? 'opacity-0 group-hover:opacity-100' : '',
        )}
      >
        <ImagePlus className="text-4xl mb-4 text-stone-300" />
        <span
          className={cn(
            'text-xs font-semibold uppercase tracking-widest',
            'text-stone-200 dark:text-stone-400',
          )}
        >
          {t('pages.editor.sections.image.upload')}
        </span>
        {showRecommendation && (
          <p className="text-xs mt-4 text-stone-300">
            {recommendation || t('pages.editor.sections.image.recommendation')}
          </p>
        )}
      </div>
      {preview && (
        <>
          <img
            alt="Recipe main image"
            className="w-full h-full object-cover"
            src={preview}
          />
          <button
            type="button"
            className={cn(
              'absolute top-3 right-3 z-20',
              'p-2 rounded-full bg-black/50 hover:bg-black/70',
              'text-white opacity-0 group-hover:opacity-100 transition-opacity',
            )}
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default RecipeImageUpload;
