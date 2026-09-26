import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

interface RecipeDescriptionInputProps {
  value?: string;
  onChange: (value: string) => void;
}

const RecipeDescriptionInput = ({ value = "", onChange }: RecipeDescriptionInputProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <label
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.1em]",
          "text-stone-500 dark:text-stone-400",
        )}
      >
        {t("pages.editor.fields.description.label")}
      </label>
      <textarea
        className={cn(
          "bg-transparent border-b border-stone-300 dark:border-stone-700",
          "focus:border-orange-700 dark:focus:border-orange-500",
          "transition-colors",
          "text-lg py-4 outline-none resize-none",
          "placeholder:text-stone-300 dark:placeholder:text-stone-600",
          "text-stone-900 dark:text-stone-100",
        )}
        placeholder={t("pages.editor.fields.description.placeholder")}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default RecipeDescriptionInput;
