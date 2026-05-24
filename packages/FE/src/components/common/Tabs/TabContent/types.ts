import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type TabContentProps = HTMLAttributes<HTMLDivElement> & {
  contentIndex: number;
  display?: CSSProperties["display"];
} & Record<string, unknown>;
