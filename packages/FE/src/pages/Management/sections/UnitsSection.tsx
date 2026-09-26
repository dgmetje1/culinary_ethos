import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Plus, Search } from "lucide-react";

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
import { useCreateUnit, useDeleteUnit, useEditUnit, useGetUnits } from "@/queries/units";
import { languages } from "@/types/user";
import type { Unit } from "@/types/unit";

type UnitFormData = {
  [lang: string]: {
    name: string;
    singularName: string;
    shortName: string;
  };
};

const emptyFormData = (): UnitFormData =>
  languages.reduce(
    (acc, lang) => ({ ...acc, [lang]: { name: "", singularName: "", shortName: "" } }),
    {} as UnitFormData,
  );

const UnitFormDialog = ({
  open,
  onOpenChange,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Unit;
}) => {
  const queryClient = useQueryClient();
  const createUnit = useCreateUnit();
  const editUnit = useEditUnit();
  const [isVisible, setIsVisible] = useState(initialData?.isVisible ?? true);
  const [formData, setFormData] = useState<UnitFormData>(
    initialData
      ? languages.reduce(
          (acc, lang) => ({
            ...acc,
            [lang]: {
              name: initialData.content[lang]?.name ?? "",
              singularName: initialData.content[lang]?.singularName ?? "",
              shortName: initialData.content[lang]?.shortName ?? "",
            },
          }),
          {} as UnitFormData,
        )
      : emptyFormData(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = Object.fromEntries(
      Object.entries(formData).filter(([, v]) => v.name),
    ) as unknown as Unit["content"];
    if (initialData) {
      await editUnit.mutateAsync({ id: initialData.id, content, isVisible } as any);
    } else {
      await createUnit.mutateAsync({ content, isVisible } as any);
    }
    queryClient.invalidateQueries({ queryKey: ["units", "getUnits"] });
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
          <DialogTitle>{initialData ? "Editar Unidad" : "Nueva Unidad"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-stone-50/50 flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
              />
              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-stone-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900" />
            </label>
            <span className="text-sm font-medium text-stone-700">Visible en catálogo</span>
          </div>
          {languages.map((lang) => (
            <div key={lang} className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-stone-50/50">
              <p className="col-span-3 text-xs font-semibold uppercase tracking-widest text-stone-500">
                {lang.toUpperCase()}
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
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Abreviatura</label>
                <input
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  value={formData[lang]?.shortName ?? ""}
                  onChange={(e) => setField(lang, "shortName", e.target.value)}
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
              disabled={createUnit.isPending || editUnit.isPending}
            >
              {createUnit.isPending || editUnit.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UnitsSection = () => {
  const { data: units, isLoading } = useGetUnits();
  const deleteUnit = useDeleteUnit();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = (units ?? []).filter((u) => {
    const name = u.content.en?.name ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-[32px] leading-[1.2] font-normal text-primary mb-2">
            Gestión de Unidades
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted-foreground">
            Administra las unidades de medida del catálogo.
          </p>
        </div>
        <Button
          className="bg-stone-900 text-white hover:bg-stone-700"
          onClick={() => {
            setEditingUnit(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Unidad
        </Button>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center border border-stone-200/50 glass-card px-4 py-2 w-full md:w-auto rounded-2xl flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 mr-2" />
          <input
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            placeholder="Buscar unidad..."
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
                ABREVIATURA
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                VISIBLE
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  Cargando unidades...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  {search ? "No se encontraron unidades." : "No hay unidades."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((unit) => (
                <TableRow key={unit.id} className="hover:bg-white/40">
                  <TableCell className="px-6 py-4 font-mono text-sm text-stone-400">{`${unit.id.slice(0, 2)}...${unit.id.slice(-6)}`}</TableCell>
                  <TableCell className="px-6 py-4 font-medium">
                    {unit.content.en?.name ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-stone-500">
                    {unit.content.en?.singularName ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-stone-500">
                    {unit.content.en?.shortName ?? "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`flex items-center text-xs ${unit.isVisible ? "text-green-600" : "text-stone-400"}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${unit.isVisible ? "bg-green-600" : "bg-stone-400"}`}
                      />
                      {unit.isVisible ? "Sí" : "No"}
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
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingUnit(unit);
                            setFormOpen(true);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteId(unit.id)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UnitFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingUnit(undefined);
        }}
        initialData={editingUnit}
      />

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Unidad</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-stone-600">
            ¿Estás seguro de que deseas eliminar esta unidad? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (deleteId) {
                  deleteUnit.mutateAsync(deleteId);
                  setDeleteId(null);
                }
              }}
              disabled={deleteUnit.isPending}
            >
              {deleteUnit.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitsSection;
