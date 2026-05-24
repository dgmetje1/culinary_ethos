import { FC, HTMLAttributes } from "react";

const cardStyle: Record<string, unknown> = {
  display: "flex",
  position: "relative",
  flex: "0 0 250px",
  maxWidth: 250,
  maxHeight: 250,
  borderRadius: "var(--radius)",
  overflow: "hidden",
  border: "1px solid hsl(var(--border))",
  backgroundColor: "hsl(var(--card))",
  transition: "all 0.2s ease-in-out",
};

const StyledRecipeCard: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    style={{
      ...cardStyle,
      ...(props.style || {}),
    }}
    className="recipe-card"
    {...props}
  />
);

const overlayStyle: Record<string, unknown> = {
  bottom: 0,
  display: "flex",
  position: "absolute",
  maxWidth: 250,
  padding: "0.25rem",
  width: "100%",
};

export const StyledRecipeCardOverlay: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
  const overlayBoxStyle = {
    ...overlayStyle,
    ...(props.style || {}),
    backgroundColor: "rgba(250, 249, 247, 0.8)",
    backdropFilter: "blur(4px)",
    border: "1px solid hsl(var(--border))",
  };
  return <div style={overlayBoxStyle} className="overlay" {...props} />;
};

export default StyledRecipeCard;
