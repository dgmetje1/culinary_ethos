import { FC, HTMLAttributes } from "react";

const StyledRecipeCard: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    style={{
      breakInside: "avoid",
      marginBottom: "var(--gutter, 24px)",
      cursor: "pointer",
    }}
    className="group"
    {...props}
  />
);

const imageWrapperStyle: Record<string, unknown> = {
  position: "relative",
  overflow: "hidden",
  marginBottom: "12px",
  borderRadius: "var(--radius)",
};

export const StyledRecipeImageWrapper: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => <div style={imageWrapperStyle} {...props} />;

export const StyledRecipeCardOverlay: FC<HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const overlayBoxStyle = {
    ...props.style,
    backgroundColor: "rgba(250, 249, 247, 0.8)",
    backdropFilter: "blur(4px)",
    border: "1px solid hsl(var(--border))",
  };
  return <div style={overlayBoxStyle} className="overlay" {...props} />;
};

export default StyledRecipeCard;
