import { CSSProperties, HTMLAttributes } from "react";

export type TabContentProps = HTMLAttributes<HTMLDivElement> & {
  contentIndex: number;
  display?: CSSProperties["display"];
} & Record<string, unknown>;
