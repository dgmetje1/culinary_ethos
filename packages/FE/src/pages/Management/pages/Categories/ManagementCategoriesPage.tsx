import Box from "@mui/material/Box";
import { Trans, useTranslation } from "react-i18next";

import DataTable from "@/components/common/DataTable";
import { useDeleteCategory, useSuspenseGetCategories } from "@/queries/categories";

import ManagementItemsPageContext, { useManagementItemsGetContextValues } from "../../context/ManagementItemsPage";
import ManagementPageConfirmDeleteModal from "../../modals/ConfirmDelete";
import { columns } from "./columns";
import ManagementCategoriesPageForm from "./Form";

const ManagementCategoriesPage = () => {
  const { t } = useTranslation();
  const contextValues = useManagementItemsGetContextValues();
  const { isConfirmModalOpen, selectedItem, closeConfirmModal } = contextValues;

  const { data: categories } = useSuspenseGetCategories();

  const { mutateAsync: deleteAsync } = useDeleteCategory();

  const onConfirmClicked = async () => {
    if (selectedItem) await deleteAsync(selectedItem);
    closeConfirmModal();
  };

  return (
    <Box p={[6, 6, 6, 8]}>
      <ManagementItemsPageContext value={contextValues}>
        <ManagementCategoriesPageForm />
        <DataTable columns={columns} data={categories} />
        <ManagementPageConfirmDeleteModal
          buttonText={t("pages.management.categories.modals.confirm_delete.button_text")}
          description={<Trans i18nKey="pages.management.categories.modals.confirm_delete.description" />}
          onButtonClicked={onConfirmClicked}
          onOpenChange={closeConfirmModal}
          open={isConfirmModalOpen}
          title={t("pages.management.categories.modals.confirm_delete.title")}
        />
      </ManagementItemsPageContext>
    </Box>
  );
};

export default ManagementCategoriesPage;
