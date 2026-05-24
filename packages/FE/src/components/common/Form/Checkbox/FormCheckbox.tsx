import React from "react";
import { useController } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { FormCheckboxProps } from "./types";

const FormCheckbox = ({ label, name, ...rest }: FormCheckboxProps) => {
  const { field } = useController({ name });

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={field.value}
        onCheckedChange={field.onChange}
        id={name}
        {...rest}
      />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
};

export default FormCheckbox;
