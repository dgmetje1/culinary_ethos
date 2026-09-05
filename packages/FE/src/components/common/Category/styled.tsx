import { FC, HTMLAttributes } from "react";

const StyledCategory: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    style={{
      columns: "1",
      columnGap: 24,
    }}
    className="md:columns-2 lg:columns-3"
    {...props}
  />
);

export default StyledCategory;
