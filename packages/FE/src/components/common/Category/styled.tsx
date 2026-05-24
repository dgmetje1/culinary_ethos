import { FC, HTMLAttributes } from "react";

const StyledCategory: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    style={{
      display: "flex",
      minHeight: 150,
      gap: "0.25rem",
      scrollbarWidth: "thin",
      scrollSnapType: "x mandatory",
      overflowX: "scroll",
      overflowY: "hidden",
      scrollMarginLeft: "8px",
      scrollMarginRight: "8px",
    }}
    {...props}
  />
);

export default StyledCategory;
