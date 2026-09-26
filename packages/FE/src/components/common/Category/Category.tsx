import { memo } from "react";

import { useGetRecipes } from "@/queries/recipes";

import RecipeCard from "../RecipeCard";
import StyledCategory from "./styled";
import { CategoryProps } from "./types";

const Category = memo(({ title, id }: CategoryProps) => {
  const { data = [], isLoading } = useGetRecipes({ categoryId: id });

  if (isLoading) return null;
  return (
    <div>
      {!!title && (
        <h4 style={{ color: "#333", fontWeight: "bold", marginBottom: "0.35em" }}>{title}</h4>
      )}
      <StyledCategory>
        {data.map((value) => (
          <RecipeCard key={value.id} {...value} />
        ))}
      </StyledCategory>
    </div>
  );
});

export default Category;
