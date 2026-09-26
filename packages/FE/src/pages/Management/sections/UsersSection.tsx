import { useState } from "react";
import { Ban, Search, Shield, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthContext } from "@/context/Auth";
import { useGetAllUsers } from "@/queries/users/queryHooks";
import { useSuspendUser, useActivateUser, useChangeUserRole } from "@/queries/users/mutations";

const ROLE_OPTIONS = [
  { value: "chef", label: "Chef", description: "Crea y edita sus propias recetas" },
  {
    value: "collaborator",
    label: "Colaborador",
    description: "Puede gestionar recetas y contenido",
  },
  { value: "admin", label: "Administrador", description: "Acceso completo a todas las funciones" },
];

const ROLE_BADGES: Record<string, string> = {
  chef: "bg-stone-100 text-stone-700",
  admin: "bg-secondary/10 text-secondary",
  collaborator: "bg-blue-50 text-blue-700",
};

const ROLE_LABELS: Record<string, string> = {
  chef: "Chef",
  admin: "Administrador",
  collaborator: "Colaborador",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-green-600",
  suspended: "text-red-600",
};

const STATUS_DOTS: Record<string, string> = {
  active: "bg-green-600",
  suspended: "bg-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Activo",
  suspended: "Suspendido",
};

const UsersSection = () => {
  const { data: users, isLoading } = useGetAllUsers();
  const { account } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();
  const changeRole = useChangeUserRole();

  const currentUserId = account?.id;

  const toggleStatus = (user: { id: string; status: string }) => {
    if (user.status === "suspended") {
      activateUser.mutate(user.id);
    } else {
      suspendUser.mutate(user.id);
    }
  };

  const isSelf = (userId: string) => userId === currentUserId;

  const filteredUsers = users?.filter((user) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-[32px] leading-[1.2] font-normal text-primary mb-2">
            Gestión de Usuarios
          </h2>
          <p className="text-[16px] leading-[1.6] text-muted-foreground">
            Administra usuarios, roles y permisos de la plataforma.
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center border border-stone-200/50 glass-card px-4 py-2 w-full md:w-auto rounded-2xl flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 mr-2" />
          <input
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            placeholder="Buscar usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-stone-100">
            Todos
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-stone-100">
            Activos
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-stone-100">
            Suspendidos
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-stone-100">
            Chefs
          </Badge>
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
                USUARIO
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                EMAIL
              </TableHead>
              <TableHead className="px-6 py-4 text-[12px] tracking-[0.1em] font-semibold uppercase text-stone-600">
                ROL
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-white/40">
                  <TableCell className="px-6 py-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-mono text-sm text-stone-400 select-all cursor-default">
                            {user.id.slice(0, 2)}...{user.id.slice(-6)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono text-xs">{user.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium">
                    {user.name} {user.lastName}
                    {isSelf(user.id) && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-stone-400">
                        (tú)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-stone-500">{user.email}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`${ROLE_BADGES[user.role] ?? "bg-stone-100 text-stone-700"} px-3 py-1 text-xs rounded-full flex items-center w-fit gap-1`}
                    >
                      <Shield className="w-3 h-3" />
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`flex items-center text-xs ${STATUS_COLORS[user.status] ?? ""}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${STATUS_DOTS[user.status] ?? "bg-stone-400"} mr-2`}
                      />
                      {STATUS_LABELS[user.status] ?? user.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Cambiar rol"
                            disabled={changeRole.isPending || isSelf(user.id)}
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuRadioGroup
                            value={user.role}
                            onValueChange={(newRole) => {
                              if (newRole !== user.role) {
                                changeRole.mutate({ id: user.id, role: newRole });
                              }
                            }}
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <DropdownMenuRadioItem
                                key={role.value}
                                value={role.value}
                                className="py-2"
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs font-medium">{role.label}</span>
                                  <span className="text-[10px] text-stone-400">
                                    {role.description}
                                  </span>
                                </div>
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${user.status === "suspended" ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}`}
                        title={
                          isSelf(user.id)
                            ? "No puedes suspender tu propia cuenta"
                            : user.role === "admin"
                              ? "No puedes suspender un administrador"
                              : user.status === "suspended"
                                ? "Activar"
                                : "Suspender"
                        }
                        onClick={() => toggleStatus(user)}
                        disabled={
                          suspendUser.isPending ||
                          activateUser.isPending ||
                          isSelf(user.id) ||
                          user.role === "admin"
                        }
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-stone-500">
                  No hay usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersSection;
