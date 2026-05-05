import { Fragment, useMemo, useState } from "react";
import { Box, Button, Grow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import Form, { FormTextField } from "@/components/common/Form";
import FormCheckbox from "@/components/common/Form/Checkbox";
import { useCreateCategory, useEditCategory, useSuspenseGetCategories } from "@/queries/categories";
import { CategoryCreateDTO } from "@/types/category";
import { languages } from "@/types/user";

import { useManagementItemsPageContext } from "../../../context/ManagementItemsPage";

const ManagementCategoriesPageForm = () => {
  const { t } = useTranslation();

  const {
    selectedItem: selectedCategory,
    setSelectedItem,
    isFormOpen,
    toggleFormOpen,
    closeForm,
  } = useManagementItemsPageContext();
  const [isFormMounted, setIsFormMounted] = useState(isFormOpen);

  const { data } = useSuspenseGetCategories();

  const defaultValues = useMemo(() => {
    const selectedCategoryInfo = data.find(category => category.id === selectedCategory);

    return selectedCategoryInfo
      ? selectedCategoryInfo
      : {
          isVisible: true,
          content: languages.reduce(
            (prev, lang) => ({ ...prev, [lang]: { name: "", singularName: "", shortName: "" } }),
            {},
          ),
        };
  }, [data, selectedCategory]);

  const validationSchema = useMemo(
    () =>
      z.object({
        content: z.record(
          z.string(),
          z.object({
            name: z.string().min(1).max(40),
            description: z.string(),
          }),
        ),
      }),
    [],
  );

  const { mutateAsync: createAsync } = useCreateCategory();
  const { mutateAsync: editAsync } = useEditCategory();

  const onFormSubmit = async (values: CategoryCreateDTO) => {
    if (selectedCategory) {
      await editAsync({ ...values, id: selectedCategory });
    } else {
      await createAsync(values);
    }

    closeForm();
  };

  const onCreateButtonClicked = () => {
    setSelectedItem(undefined);
    toggleFormOpen();
  };

  return (
    <Box display="flex" flexDirection="column" py={3}>
      <Button
        disabled={isFormOpen}
        onClick={onCreateButtonClicked}
        sx={{ color: "grey.800", ml: "auto", fontWeight: 600 }}
        variant="contained"
      >
        {t("pages.management.categories.form.button")}
      </Button>
      {(isFormOpen || isFormMounted) && (
        <Grow in={isFormOpen} onEnter={() => setIsFormMounted(true)} onExited={() => setIsFormMounted(false)}>
          <Form defaultValues={defaultValues} onFormSubmit={onFormSubmit} validationSchema={validationSchema}>
            <Box
              alignItems="center"
              boxShadow="1px 4px 6px #aaa"
              columnGap={3}
              display="grid"
              gridTemplateColumns="minmax(70px,max-content) repeat(2,minmax(120px, max-content)) auto"
              mt={2}
              p={3}
              rowGap={2}
            >
              {languages.map(language => (
                <Fragment key={language}>
                  <Typography fontWeight="bold">{t(`languages.${language}`)}</Typography>
                  <FormTextField
                    label={t("pages.management.categories.form.fields.name")}
                    name={`content.${language}.name`}
                  />
                  <FormTextField
                    label={t("pages.management.categories.form.fields.singular_name")}
                    name={`content.${language}.singularName`}
                  />
                  <FormTextField
                    label={t("pages.management.categories.form.fields.short_name")}
                    name={`content.${language}.shortName`}
                    sx={{ maxWidth: "140px" }}
                  />
                </Fragment>
              ))}
              <FormCheckbox label={t("pages.management.categories.form.fields.is_visible")} name="isVisible" />
              <Box display="flex" gap={2} gridColumn="1 / 1">
                <Button color="secondary" onClick={closeForm} size="large">
                  {t("common.buttons.cancel")}
                </Button>
                <Button size="large" type="submit" variant="contained">
                  {t("common.buttons.save")}
                </Button>
              </Box>
            </Box>
          </Form>
        </Grow>
      )}
    </Box>
  );
};

export default ManagementCategoriesPageForm;
