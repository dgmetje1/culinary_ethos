import { createContext, useContext } from "react";

export const FormContext = createContext<unknown>(null);

export const FormContextProvider = FormContext.Provider;

export function useFormInstance() {
  const ctx = useContext(FormContext);
  if (!ctx)
    throw new Error("useFormInstance must be used within a Form component");
  return ctx;
}
