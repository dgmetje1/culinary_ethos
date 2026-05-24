import { FormEvent, PropsWithChildren, useCallback } from "react";
import { useForm } from "@tanstack/react-form";

import { FormProps } from "./types";
import { FormContextProvider } from "./FormContext";

const Form = <FormValues extends object>({
  children,
  defaultValues,
  onFormSubmit,
  validationSchema,
  ref,
  ...rest
}: PropsWithChildren<FormProps<FormValues>>) => {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: defaultValues as any,
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: validationSchema as any,
    },
    onSubmit: async ({ value }) => {
      onFormSubmit(value as FormValues);
      form.reset();
    },
  });

  const onSubmitted = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();
      await form.handleSubmit();
    },
    [form],
  );

  return (
    <FormContextProvider value={form}>
      <form {...rest} onSubmit={onSubmitted} ref={ref}>
        {children}
      </form>
    </FormContextProvider>
  );
};

export default Form;
