import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateIngredient,
  useDeleteIngredient,
  useEditIngredient,
  useGetIngredients,
} from "@/queries/ingredients";
import { languages } from "@/types/user";
import type { Ingredient } from "@/types/ingredients";

type IngredientFormData = {
  [lang: string]: {
    name: string;
    singularName: string;
  };
};

const emptyFormData = (): IngredientFormData =>
  languages.reduce(
    (acc, lang) => ({ ...acc, [lang]: { name: "", singularName: "" } }),
    {} as IngredientFormData,
  );

const IngredientFormDialog = ({
  open,
  onOpenChange,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Ingredient;
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const createIngredient = useCreateIngredient();
  const editIngredient = useEditIngredient();
  const [formData, setFormData] = useState<IngredientFormData>(
    initialData
      ? languages.reduce(
          (acc, lang) => ({
            ...acc,
            [lang]: {
              name: initialData.content[lang]?.name ?? "",
              singularName: initialData.content[lang]?.singularName ?? "",
            },
          }),
          {} as IngredientFormData,
        )
      : emptyFormData(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = Object.fromEntries(Object.entries(formData).filter(([, v]) => v.name));
    if (initialData) {
      await editIngredient.mutateAsync({ id: initialData.id, content });
    } else {
      await createIngredient.mutateAsync({ content });
    }
    queryClient.invalidateQueries({
      queryKey: ["ingredients", "getIngredients"],
    });
    onOpenChange(false);
  };

  const setField = (lang: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Ingrediente" : "Nuevo Ingrediente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {languages.map((lang) => (
            <div key={lang} className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-stone-50/50">
              <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-stone-500">
                {t(`languages.${lang}`)}
              </p>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  value={formData[lang]?.name ?? ""}
                  onChange={(e) => setField(lang, "name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Singular</label>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  value={formData[lang]?.singularName ?? ""}
                  onChange={(e) => setField(lang, "singularName", e.target.value)}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-stone-900 text-white hover:bg-stone-700"
              disabled={createIngredient.isPending || editIngredient.isPending}
            >
              {createIngredient.isPending || editIngredient.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const IngredientsSection = () => {
  const { t } = useTranslation();
  const { data: ingredients, isLoading } = useGetIngredients();
  const deleteIngredient = useDeleteIngredient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = (ingredients ?? []).filter((ing) => {
    const name = ing.content.en?.name ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleEdit = (ing: Ingredient) => {
    setEditingIngredient(ing);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteIngredient.mutateAsync(id);
    setDeleteId(null);
  };

  const handleCreate = () => {
    setEditingIngredient(undefined);
    setFormOpen(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-[32px] leading-[1.2] font-normal text-primary mb-2">
            Gestión de Ingredientes
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted-foreground">
            Administra el catálogo completo de ingredientes.
          </p>
        </div>
        <Button className="bg-stone-900 text-white hover:bg-stone-700" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ingrediente
        </Button>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center border border-stone-200/50 glass-card px-4 py-2 w-full md:w-auto rounded-2xl flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 mr-2" />
          <input
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                NOMBRE
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                SINGULAR
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                TRADUCIDO
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-stone-500">
                  Cargando ingredientes...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-stone-500">
                  {search ? "No se encontraron ingredientes." : "No hay ingredientes."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((ing) => {
                const translatedCount = languages.filter((l) => ing.content[l]?.name).length;
                const isFullyTranslated = translatedCount === languages.length;

                return (
                  <TableRow key={ing.id} className="hover:bg-white/40">
                    <TableCell className="px-6 py-4 font-mono text-sm text-stone-400">
                      {`${ing.id.slice(0, 2)}...${ing.id.slice(-6)}`}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium">
                      {ing.content.en?.name ?? "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-stone-500">
                      {ing.content.en?.singularName ?? "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`flex items-center text-xs ${
                          isFullyTranslated ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            isFullyTranslated ? "bg-green-600" : "bg-amber-600"
                          }`}
                        />
                        {isFullyTranslated ? "Completo" : `${translatedCount}/${languages.length}`}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4 text-stone-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(ing)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(ing.id)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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

      <IngredientFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingIngredient(undefined);
        }}
        initialData={editingIngredient}
      />

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Ingrediente</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600">
            ¿Estás seguro de que deseas eliminar este ingrediente? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteIngredient.isPending}
            >
              {deleteIngredient.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientsSection;
