import { Api } from "@/lib/api";
import { CategoriesDTO } from "@/types/category";

export const getCategories = () => {
  return new Api().get<CategoriesDTO>("categories");
};
