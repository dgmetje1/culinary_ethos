import { DetailedHTMLProps, FormHTMLAttributes } from "react";

export type Props<FormValues extends object> = {
  readonly defaultValues: FormValues;
  readonly validationSchema: unknown;
  readonly onFormSubmit: (values: FormValues) => void;
  readonly onFormSubmitError?: () => void;
};

export type FormProps<FormValues extends object> = Props<FormValues> &
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
