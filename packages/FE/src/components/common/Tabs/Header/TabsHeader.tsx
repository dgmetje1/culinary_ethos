import { Children, cloneElement, isValidElement, ReactElement } from "react";

import { useTabsContext } from "../Context";
import { TabsHeaderProps } from "./types";

const TabsHeader = ({ children, ...rest }: TabsHeaderProps) => {
  const { index, onTabChange } = useTabsContext();

  return (
    <div role="tablist" className="flex border-b border-stone-200" {...rest}>
      {Children.map(children, (child, i) => {
        if (isValidElement(child)) {
          return cloneElement(child as ReactElement<{ onClick?: () => void; active?: boolean }>, {
            onClick: () => onTabChange(i),
            active: index === i,
          });
        }
        return child;
      })}
    </div>
  );
};
export default TabsHeader;
