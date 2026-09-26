import { type PropsWithChildren, type HTMLAttributes } from "react";

const RecipeDetailPageCard = ({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) => (
  <section
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "0.75rem 1rem",
      backgroundColor: "#f0efef",
      gap: "0.25rem",
      borderRadius: "var(--radius)",
    }}
    {...rest}
  >
    {children}
  </section>
);

export default RecipeDetailPageCard;
