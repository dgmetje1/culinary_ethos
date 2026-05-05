/* eslint-disable react-hooks/rules-of-hooks */

import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { Category } from "@/types/category";

import ManagementCategoriesPageTableActions from "./TableActions";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: () => {
      const { t } = useTranslation();
      return t("pages.management.categories.table.id");
    },
    size: 150,
  },

  {
    accessorKey: "content.en.name",
    header: () => {
      const { t } = useTranslation();
      return t("pages.management.categories.table.name");
    },
    size: 150,
  },
  {
    accessorKey: "content.en.singularName",
    header: () => {
      const { t } = useTranslation();
      return t("pages.management.categories.table.singular_name");
    },
    size: 150,
  },
  {
    accessorKey: "content.en.shortName",
    header: () => {
      const { t } = useTranslation();
      return t("pages.management.categories.table.short_name");
    },
    size: 50,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ManagementCategoriesPageTableActions id={row.original.id} />,
    size: 30,
  },
];
