import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Recipe } from "@/types/recipe";
import RecipeDetailPageIngredientsCard from "@/pages/RecipeDetail/cards/Ingredients";
import RecipeDetailPageKitchenwareCard from "@/pages/RecipeDetail/cards/Kitchenware";
import RecipeDetailPageInfoCard from "@/pages/RecipeDetail/cards/Info";
import RecipeDetailPageAuthorCard from "@/pages/RecipeDetail/cards/Author";
import RecipeDetailPageStepsSection from "@/pages/RecipeDetail/sections/Steps";

type RecipePreviewDialogProps = {
  recipe: Recipe | null;
  onClose: () => void;
};

const RecipePreviewDialog = ({ recipe, onClose }: RecipePreviewDialogProps) => {
  return (
    <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-[#faf9f7]">
        <div className="overflow-y-auto max-h-[90vh] rounded-lg">
          {recipe &&
            (() => {
              const timeInMinutes = Math.floor(recipe.time / 60);
              return (
                <>
                  <section className="relative w-full h-[400px] overflow-hidden">
                    {recipe.headerImg ? (
                      <img
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        src={recipe.headerImg}
                      />
                    ) : recipe.thumbnailUrl ? (
                      <img
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        src={recipe.thumbnailUrl}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-stone-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end">
                      <div className="max-w-[1200px] mx-auto w-full px-8 pb-12">
                        <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full mb-4 border border-white/30">
                          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white">
                            {recipe.categories?.length
                              ? recipe.categories.map((c) => c.name).join(" • ")
                              : "Recipe"}{" "}
                            &middot; {timeInMinutes} min
                          </span>
                        </div>
                        <h1 className="font-serif text-4xl text-white max-w-2xl italic">
                          {recipe.title}
                        </h1>
                      </div>
                    </div>
                  </section>

                  <div className="max-w-[1200px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">
                    <aside className="md:col-span-4 space-y-10">
                      <RecipeDetailPageIngredientsCard ingredients={recipe.ingredients} />
                      <RecipeDetailPageKitchenwareCard kitchenware={recipe.kitchenware} />
                      <RecipeDetailPageInfoCard
                        difficulty={recipe.difficulty}
                        time={recipe.time}
                        portions={recipe.portions}
                      />
                      <RecipeDetailPageAuthorCard authorId={recipe.author} />
                    </aside>

                    <article className="md:col-span-8 space-y-14">
                      {recipe.description && (
                        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-xl border border-stone-200/30">
                          <p className="text-lg text-stone-600 leading-relaxed italic">
                            {recipe.description}
                          </p>
                        </div>
                      )}
                      {recipe.steps && recipe.steps.length > 0 && (
                        <div className="bg-white/70 backdrop-blur-xl p-10 rounded-xl border border-stone-200/30">
                          <h3 className="text-xl font-serif border-b border-stone-300 pb-4 mb-10">
                            Pasos
                          </h3>
                          <RecipeDetailPageStepsSection steps={recipe.steps} />
                        </div>
                      )}
                    </article>
                  </div>
                </>
              );
            })()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipePreviewDialog;
