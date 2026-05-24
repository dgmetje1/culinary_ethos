import { FC, HTMLAttributes } from "react";

export const StyledManagementLayout: FC<HTMLAttributes<HTMLElement> & { open?: boolean; menuWidth?: number }> = ({
  open,
  menuWidth = 240,
  style,
  ...props
}) => (
  <main
    style={{
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      backgroundColor: "#eaf3e7",
      minHeight: "100dvh",
      transition: "margin 0.3s ease, max-width 0.3s ease",
      marginLeft: open ? `${menuWidth}px` : 0,
      maxWidth: open ? `calc(100% - ${menuWidth}px)` : "100%",
      ...style,
    }}
    {...props}
  />
);
