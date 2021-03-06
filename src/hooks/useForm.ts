import { useCallback, useMemo } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UnpackNestedValue,
  UseFormProps as UseFormOriginalProps,
  UseFormReturn as UseFormOriginalReturn,
} from "react-hook-form";
import { useForm as useFormOriginal } from "react-hook-form";

type UseFormOptions<
  Fields extends FieldValues = FieldValues,
  Context extends Record<string, unknown> = Record<string, unknown>
> = Partial<Omit<UseFormOriginalProps<Fields, Context>, "defaultValues">>;

type UseFormConfig<
  Fields extends FieldValues = FieldValues,
  Context extends Record<string, unknown> = Record<string, unknown>
> = Required<Pick<UseFormOriginalProps<Fields, Context>, "defaultValues">>;

type FieldNames<Fields extends FieldValues> = {
  readonly [FieldName in keyof Fields]: FieldName;
};

export type UseFormReturn<
  Fields extends FieldValues = FieldValues,
  Context extends Record<string, unknown> = Record<string, unknown>
> = UseFormOriginalReturn<Fields, Context> & {
  fieldNames: FieldNames<Fields>;
  resetForm: () => void;
};

export function useForm<
  Fields extends FieldValues = FieldValues,
  Context extends Record<string, unknown> = Record<string, unknown>
>(
  config: UseFormConfig<Fields, Context>,
  options?: UseFormOptions<Fields, Context>
): UseFormReturn<Fields, Context> {
  const form = useFormOriginal<Fields, Context>({
    ...config,
    mode: "onTouched",
    shouldUnregister: true,
    ...options,
  });

  const fieldNames = useMemo(
    () =>
      Object.keys(config.defaultValues).reduce(
        (obj, key) => ({ ...obj, [key]: key }),
        {} as FieldNames<Fields>
      ),
    [config.defaultValues]
  );

  const resetForm = useCallback(() => {
    const formValues = form.getValues();

    Object.entries<UnpackNestedValue<PathValue<Fields, Path<Fields>>>>(
      formValues
    ).forEach(([key, val]) => {
      const fieldName = key as Path<Fields>;
      const defaultFieldVal = config.defaultValues[fieldName];

      form.setValue(
        fieldName,
        defaultFieldVal === undefined ? val : defaultFieldVal
      );
      form.clearErrors(fieldName);
    });
  }, [config.defaultValues, form]);

  return { ...form, fieldNames, resetForm };
}
