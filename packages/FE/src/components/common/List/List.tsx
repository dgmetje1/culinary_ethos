import { memo } from "react";

import { ListItem, ListProps } from "./types";

const List = <T extends ListItem>({
  items,
  renderItem,
  title,
  shouldSeeMoreBeShown,
}: ListProps<T>) => (
  <>
    {title}
    <ul style={{ display: "flex", flexDirection: "column" }}>
      {items.map((item) => (
        <li key={item.id}>
          <span>{renderItem(item)}</span>
        </li>
      ))}
      {shouldSeeMoreBeShown && (
        <li>
          <span style={{ fontWeight: 600 }}>...</span>
        </li>
      )}
    </ul>
  </>
);

export default memo(List) as typeof List;
