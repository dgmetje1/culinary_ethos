export const API_ACTION_BASE = "categories";

export const getCategoriesKeys = () => {
  const queryKey = [API_ACTION_BASE, "getCategories"];
  const key = queryKey.join("/");

  return { key, queryKey };
};
