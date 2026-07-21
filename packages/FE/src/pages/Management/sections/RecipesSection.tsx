import { useState } from "react";
import { Check, Eye, Flag, Search, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RecipePreviewDialog from "@/components/common/RecipePreviewDialog";
import AuthorName from "@/components/common/AuthorName/AuthorName";
import { useGetAdminRecipes } from "@/queries/recipes/queryHooks";
import { useApproveRecipe, useFlagRecipe, useBanRecipe, useDeleteRecipe } from "@/queries/recipes/mutations";
import type { AdminRecipe } from "@/queries/recipes/queries";

const STATUS_LABELS: Record<string, string> = {
  published: "Publicada",
  flagged: "En Revisión",
  approved: "Aprobada",
  banned: "Baneada",
};

const STATUS_COLORS: Record<string, string> = {
  published: "text-green-600",
  flagged: "text-amber-600",
  approved: "text-green-600",
  banned: "text-red-600",
};

const STATUS_DOTS: Record<string, string> = {
  published: "bg-green-600",
  flagged: "bg-amber-600",
  approved: "bg-green-600",
  banned: "bg-red-600",
};

  const FLAGGABLE_STATUSES = ["published", "approved"];

const RecipesSection = () => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>("flagged");
  const [previewRecipe, setPreviewRecipe] = useState<AdminRecipe | null>(null);
  const { data: recipes, isLoading } = useGetAdminRecipes(statusFilter);
  const approveRecipe = useApproveRecipe();
  const flagRecipe = useFlagRecipe();
  const banRecipe = useBanRecipe();
  const deleteRecipe = useDeleteRecipe();

  const filters = [
    { label: "Todas", value: undefined },
    { label: "Publicadas", value: "published" },
    { label: "En Revisión", value: "flagged" },
    { label: "Aprobadas", value: "approved" },
    { label: "Baneadas", value: "banned" },
  ];

  const canFlag = (status?: string) => status && FLAGGABLE_STATUSES.includes(status);

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="mb-12">
        <h2 className="font-serif text-[32px] leading-[1.2] font-normal text-primary mb-2">
          Gestión de Recetas
        </h2>
        <p className="text-[16px] leading-[1.6] text-muted-foreground">
          Revisa, aprueba o rechaza las recetas reportadas.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center border border-stone-200/50 glass-card px-4 py-2 w-full md:w-auto rounded-2xl">
          <Search className="w-4 h-4 text-stone-400 mr-2" />
          <input
            className="bg-transparent border-none focus:outline-none text-sm w-full md:w-64"
            placeholder="Buscar receta..."
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Badge
              key={f.label}
              variant="outline"
              className={`cursor-pointer hover:bg-stone-100 ${statusFilter === f.value ? "bg-stone-200" : ""}`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200/30 glass-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-100/40">
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">ID</TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">TÍTULO</TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">AUTOR</TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">ESTADO</TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">FECHA</TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  Cargando recetas...
                </TableCell>
              </TableRow>
            ) : recipes && recipes.length > 0 ? (
              recipes.map((recipe) => (
                <TableRow key={recipe.id} className="hover:bg-white/40">
                  <TableCell className="px-6 py-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono text-sm text-stone-400 select-all cursor-default">
                            {recipe.id.slice(0, 2)}...{recipe.id.slice(-6)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono text-xs">{recipe.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium">{recipe.title}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-stone-500"><AuthorName authorId={recipe.author} /></TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`flex items-center text-xs ${STATUS_COLORS[recipe.status ?? "published"]}`}>
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOTS[recipe.status ?? "published"]} mr-2`} />
                      {STATUS_LABELS[recipe.status ?? "published"]}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-stone-500">
                    {recipe.publicationDate ? new Date(recipe.publicationDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Vista previa" onClick={() => setPreviewRecipe(recipe)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {canFlag(recipe.status) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          title="Reportar"
                          onClick={() => flagRecipe.mutate(recipe.id)}
                          disabled={flagRecipe.isPending}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      )}
                      {recipe.status === "flagged" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Aprobar"
                            onClick={() => approveRecipe.mutate(recipe.id)}
                            disabled={approveRecipe.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Banear"
                            onClick={() => banRecipe.mutate(recipe.id)}
                            disabled={banRecipe.isPending}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {recipe.status === "banned" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar"
                          onClick={() => deleteRecipe.mutate(recipe.id)}
                          disabled={deleteRecipe.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  No hay recetas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <RecipePreviewDialog recipe={previewRecipe} onClose={() => setPreviewRecipe(null)} />
    </div>
  );
};

export default RecipesSection;
