import React from "react";
import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

import { FormTextFieldProps } from "./types";

const FormTextField = ({ name, ...rest }: FormTextFieldProps) => {
  const inputRef = React.useRef(null);

  const { field } = useController({ name });

  return (
    <TextField
      {...rest}
      {...field}
      ref={inputRef}
      variant="outlined"
      size="medium"
      sx={{
        borderRadius: "var(--radius)",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "hsl(var(--border))",
          },
          "&:hover fieldset": {
            borderColor: "hsl(var(--primary))",
          },
          "&.Mui-focused fieldset": {
            borderColor: "hsl(var(--primary))",
          },
          "& input": {
            color: "hsl(var(--foreground))",
          },
          "& label": {
            color: "hsl(var(--muted-foreground))",
          },
          "&.Mui-focused label": {
            color: "hsl(var(--primary))",
          },
        }}
      }}
    />
  );
};

export default FormTextField;
