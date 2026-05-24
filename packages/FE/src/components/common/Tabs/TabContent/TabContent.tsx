import { useTabsContext } from "../Context";
import { TabContentProps } from "./types";

const TabContent = ({ children, contentIndex, display, style, ...rest }: TabContentProps) => {
  const { index } = useTabsContext();

  const hidden = index !== contentIndex;

  return (
    <div
      hidden={hidden}
      role="tabpanel"
      style={{
        ...style,
        display: hidden ? "none" : (display as string | undefined),
        padding: "0.5rem",
      }}
      {...rest}
    >
      {index === contentIndex && children}
    </div>
  );
};

export default TabContent;
