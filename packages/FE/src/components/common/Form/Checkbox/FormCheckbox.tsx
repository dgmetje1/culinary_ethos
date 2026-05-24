import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { FormCheckboxProps } from "./types";
import { useFormInstance } from "../FormContext";

const FormCheckbox = ({ label, name, ...rest }: FormCheckboxProps) => {
  const form = useFormInstance() as {
    Field: <TData>(props: {
      name: string;
      children: (field: {
        state: { value: TData };
        handleChange: (v: TData) => void;
      }) => React.ReactNode;
    }) => React.ReactElement;
  };

  return (
    <form.Field name={name}>
      {(field: { state: { value: boolean }; handleChange: (v: boolean) => void }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={field.state.value}
            onCheckedChange={(checked) => field.handleChange(checked as boolean)}
            id={name}
            {...rest}
          />
          <Label htmlFor={name}>{label}</Label>
        </div>
      )}
    </form.Field>
  );
};

export default FormCheckbox;
