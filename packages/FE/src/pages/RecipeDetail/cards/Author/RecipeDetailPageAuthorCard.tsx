import { useTranslation } from "react-i18next";
import { ChefHat, Loader2 } from "lucide-react";

import { cn, composeCdnUrl } from "@/lib/utils";
import config from "@/config";
import { useApiQuery } from "@/middleware/api";
import { getUserSummaryKeys } from "@/queries/users/keys";
import { getUserSummary } from "@/queries/users/queries";

interface RecipeDetailPageAuthorCardProps {
  authorId: string;
}

const RecipeDetailPageAuthorCard = ({ authorId }: RecipeDetailPageAuthorCardProps) => {
  const { t } = useTranslation();
  const { key, queryKey } = getUserSummaryKeys(authorId);
  const { data: user, isLoading } = useApiQuery(key, queryKey, () =>
    getUserSummary(authorId),
  );

  const displayName = user?.nickName || user?.name || authorId;
  const avatarUrl = user?.profilePicture
    ? composeCdnUrl(config.cdnUrl, user.profilePicture)
    : null;

  return (
    <div
      className={cn(
        "bg-white/70 dark:bg-stone-900/70",
        "backdrop-blur-xl",
        "p-8 rounded-xl",
        "border border-stone-200/30 dark:border-stone-800/30",
      )}
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
          ) : avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <ChefHat className="w-8 h-8 text-stone-500" />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              "text-stone-500 dark:text-stone-400",
            )}
          >
            {t("pages.recipe.author_title").toUpperCase()}
          </p>
          <p className="text-xl font-serif truncate">
            {isLoading ? "—" : displayName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPageAuthorCard;
