import { CSSProperties } from "react";
import { InputProps } from "@/components/ui/input";

export type FormTextFieldProps = { label: string; sx?: CSSProperties; name: string } & Partial<InputProps>;
