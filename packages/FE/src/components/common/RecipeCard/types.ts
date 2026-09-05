import { RecipeListItem } from "@/types/recipe";

export type RecipeCardProps = RecipeListItem & {
  onToggleSave?: (id: string) => void;
  isSaved?: boolean;
  isPending?: boolean;
};
