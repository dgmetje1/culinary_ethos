import { useController } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormTextFieldProps } from "./types";

const FormTextField = ({ label, name, sx, className, ...rest }: FormTextFieldProps) => {
  const { field } = useController({ name });

  return (
    <div className="space-y-2" style={sx}>
      <Label htmlFor={name}>{label}</Label>
      <Input {...field} {...rest} id={name} className={className} />
    </div>
  );
};

export default FormTextField;