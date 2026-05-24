import { ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  active?: boolean;
};

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ label, active, ...rest }, ref) => (
    <button
      ref={ref}
      role="tab"
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors",
        "border-b-2 border-transparent",
        active ? "border-stone-900 text-stone-900" : "text-stone-500 hover:text-stone-700",
      )}
      {...rest}
    >
      {label}
    </button>
  ),
);
Tab.displayName = "Tab";

export default Tab;
