import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormTextFieldProps } from "./types";
import { useFormInstance } from "../FormContext";

const FormTextField = ({ label, name, sx, className, ...rest }: FormTextFieldProps) => {
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
      {(field: { state: { value: string }; handleChange: (v: string) => void }) => (
        <div className="space-y-2" style={sx}>
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            className={className}
            {...rest}
          />
        </div>
      )}
    </form.Field>
  );
};

export default FormTextField;
