import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface RecipeTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const RecipeTitleInput = ({ value, onChange, error }: RecipeTitleInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <label
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.1em]",
          "text-stone-500 dark:text-stone-400",
        )}
      >
        {t("pages.editor.fields.title.label")}
      </label>
      <input
        className={cn(
          "bg-transparent border-b border-stone-300 dark:border-stone-700",
          "focus:border-orange-700 dark:focus:border-orange-500",
          "transition-colors",
          "text-3xl font-serif italic py-4 outline-none",
          "placeholder:text-stone-300 dark:placeholder:text-stone-600",
          "text-stone-900 dark:text-stone-100",
          error && "border-red-500 focus:border-red-500",
        )}
        placeholder={t("pages.editor.fields.title.placeholder")}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default RecipeTitleInput;
