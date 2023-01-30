import { zodResolver } from "@hookform/resolvers/zod";
import type { EmptyObject } from "@types";
import type { FieldPath, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm as useFormOriginal } from "react-hook-form";
import type { Except } from "type-fest";
import type { z } from "zod";

export type FieldNamesFn<Schema extends z.ZodTypeAny> = <
  T extends FieldPath<z.output<Schema>>
>(
  name: T
) => T;

export function useValidatedForm<Schema extends z.ZodTypeAny>(
  schema: Schema,
  props?: Except<UseFormProps<z.output<Schema>, EmptyObject>, "resolver">
): UseFormReturn<z.output<Schema>, EmptyObject> & {
  fieldNames: FieldNamesFn<Schema>;
} {
  const form = useFormOriginal<z.output<Schema>, EmptyObject>({
    ...props,
    resolver: zodResolver(schema),
    defaultValues: props?.defaultValues
      ? recursivelyNumToString(props.defaultValues)
      : undefined,
  });

  return {
    ...form,
    fieldNames<T extends FieldPath<z.output<Schema>>>(name: T): T {
      return name;
    },
  };
}

function recursivelyNumToString<T>(value: T): T {
  return ((): unknown => {
    if (value === null || value === undefined || typeof value === "string") {
      return value;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map((v) => recursivelyNumToString(v));
    }

    if (typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, recursivelyNumToString(v)])
      );
    }

    return value;
  })() as T;
}
