import { CSSProperties } from "react";
import { UseControllerProps } from "react-hook-form";
import { InputProps } from "@/components/ui/input";

export type FormTextFieldProps = { label: string; sx?: CSSProperties } & UseControllerProps & Partial<InputProps>;