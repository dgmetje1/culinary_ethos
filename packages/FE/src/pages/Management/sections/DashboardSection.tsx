import { useState } from "react";
import { ArrowRight, Calculator, Check, Eye, MoreVertical, Search, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RecipePreviewDialog from "@/components/common/RecipePreviewDialog";
import AuthorName from "@/components/common/AuthorName/AuthorName";
import { useGetDashboardStats } from "@/queries/backoffice/queryHooks";
import { useGetAdminRecipes } from "@/queries/recipes/queryHooks";
import { useApproveRecipe, useBanRecipe } from "@/queries/recipes/mutations";
import type { AdminRecipe } from "@/queries/recipes/queries";

const INGREDIENTS = [
  {
    id: "#ING-001",
    name: "Aceite de Oliva Extra Virgen",
    category: "Aceites",
    stock: "450 L",
    status: "Óptimo",
    statusColor: "text-green-600",
    dotColor: "bg-green-600",
  },
  {
    id: "#ING-002",
    name: "Harina de Trigo Tipo 00",
    category: "Granos",
    stock: "1,200 Kg",
    status: "Óptimo",
    statusColor: "text-green-600",
    dotColor: "bg-green-600",
  },
  {
    id: "#ING-003",
    name: "Trufa Negra del Perigord",
    category: "Lujo",
    stock: "3.5 Kg",
    status: "Crítico",
    statusColor: "text-orange-500",
    dotColor: "bg-orange-500",
  },
  {
    id: "#ING-004",
    name: "Azafrán en Hebras",
    category: "Especias",
    stock: "0.8 Kg",
    status: "Óptimo",
    statusColor: "text-green-600",
    dotColor: "bg-green-600",
  },
];

const DashboardSection = () => {
  const navigate = useNavigate();
  const [previewRecipe, setPreviewRecipe] = useState<AdminRecipe | null>(null);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: pendingRecipes, isLoading: recipesLoading } = useGetAdminRecipes("flagged");
  const approveRecipe = useApproveRecipe();
  const banRecipe = useBanRecipe();

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4">
        <div>
          <h2 className="font-serif text-[32px] leading-[1.2] font-normal text-primary mb-2">
            Panel de Control
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted-foreground">
            Bienvenido de nuevo. Aquí tienes un resumen de la actividad de hoy.
          </p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="glass-card px-6 py-4 border border-border/30 rounded-2xl">
            <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold uppercase text-muted-foreground mb-1">
              PENDIENTES
            </p>
            <p className="font-serif text-[24px] leading-[1.3] font-medium text-primary">
              {statsLoading ? "..." : (stats?.pendingRecipes ?? 0)}
            </p>
          </div>
          <div className="glass-card px-6 py-4 border border-border/30 rounded-2xl">
            <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold uppercase text-muted-foreground mb-1">
              NUEVOS USUARIOS
            </p>
            <p className="font-serif text-[24px] leading-[1.3] font-medium text-primary">
              {statsLoading ? "..." : (stats?.newUsers ?? 0)}
            </p>
          </div>
          <div className="glass-card px-6 py-4 border border-secondary/30 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-secondary/60 transition-all">
            <div className="absolute top-0 right-0 bg-secondary text-white text-[8px] font-bold px-2 py-1 rounded-bl-lg tracking-widest uppercase">
              PREMIUM
            </div>
            <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold uppercase text-muted-foreground mb-1 flex items-center">
              COSTE DE RECETA
              <Calculator className="w-[14px] h-[14px] ml-1 text-secondary" />
            </p>
            <p className="font-serif text-[24px] leading-[1.3] font-medium text-primary">
              €12.45
              <span className="text-xs font-sans text-stone-400 font-normal"> / ración</span>
            </p>
          </div>
        </div>
      </header>

      <section className="mb-[80px]">
        <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium italic">
            Recetas pendientes de validación
          </h3>
          <Button
            variant="link"
            className="text-secondary text-[12px] tracking-[0.1em] font-semibold uppercase"
            onClick={() => navigate({ to: "/management/recipes" } as any)}
          >
            VER TODAS
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
        {recipesLoading ? (
          <p className="text-stone-500 text-sm">Cargando recetas...</p>
        ) : pendingRecipes && pendingRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pendingRecipes.map((recipe) => (
              <article
                key={recipe.id}
                className="group glass-card border border-stone-200/30 overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      recipe.thumbnailUrl ??
                      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[12px] leading-[1.0] tracking-[0.1em] font-semibold uppercase text-secondary mb-2">
                    {recipe.categories?.[0]?.name ?? "General"}
                  </p>
                  <h4 className="font-serif text-[18px] leading-[1.3] font-medium mb-4">
                    {recipe.title}
                  </h4>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-stone-500">
                      <AuthorName authorId={recipe.author} />
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Vista previa"
                        onClick={() => setPreviewRecipe(recipe)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-stone-200/50 text-destructive hover:bg-destructive/10"
                        onClick={() => banRecipe.mutate(recipe.id)}
                        disabled={banRecipe.isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-stone-900 text-white hover:bg-stone-700"
                        onClick={() => approveRecipe.mutate(recipe.id)}
                        disabled={approveRecipe.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 text-sm">No hay recetas pendientes.</p>
        )}
      </section>

      <section className="mb-[80px]">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h3 className="font-serif text-[24px] leading-[1.3] font-medium italic">
            Gestión de Ingredientes
          </h3>
          <div className="flex items-center border border-stone-200/50 glass-card px-4 py-2 w-full md:w-auto rounded-2xl">
            <Search className="w-4 h-4 text-stone-400 mr-2" />
            <input
              className="bg-transparent border-none focus:outline-none text-sm w-full md:w-64"
              placeholder="Buscar ingrediente..."
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-stone-200/30 glass-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-100/40">
                <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                  ID
                </TableHead>
                <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                  INGREDIENTE
                </TableHead>
                <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                  CATEGORÍA
                </TableHead>
                <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                  STOCK
                </TableHead>
                <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                  ESTADO
                </TableHead>
                <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                  ACCIONES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INGREDIENTS.map((ing) => (
                <TableRow key={ing.id} className="hover:bg-white/40">
                  <TableCell className="px-6 py-4 font-mono text-sm text-stone-400">
                    {ing.id}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium">{ing.name}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="bg-stone-100/50 px-3 py-1 text-xs rounded-full">
                      {ing.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-sans text-sm">{ing.stock}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`flex items-center text-xs ${ing.statusColor}`}>
                      <span className={`w-2 h-2 rounded-full ${ing.dotColor} mr-2`} />
                      {ing.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <MoreVertical className="w-4 h-4 text-stone-400 cursor-pointer hover:text-stone-900" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="px-8 py-3 border-stone-900 text-[12px] tracking-[0.1em] font-semibold uppercase hover:bg-stone-900 hover:text-white rounded-2xl h-auto"
          >
            CARGAR MÁS INGREDIENTES
          </Button>
        </div>
      </section>

      <RecipePreviewDialog recipe={previewRecipe} onClose={() => setPreviewRecipe(null)} />
    </div>
  );
};

export default DashboardSection;
