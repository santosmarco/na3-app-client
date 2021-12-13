import type { AutoCompleteProps as AntdAutoCompleteProps } from "antd";
import { AutoComplete as AntdAutoComplete } from "antd";
import { nanoid } from "nanoid";
import React from "react";

export type AutoCompleteOptionBase<Value extends string = string> = {
  disabled?: boolean;
  label: React.ReactNode;
  value: Value;
};

type AutoCompleteOptionGroup<Value extends string = string> = {
  label: React.ReactNode;
  options: Array<AutoCompleteOptionBase<Value>>;
};

type AutoCompleteOption<Value extends string> =
  | AutoCompleteOptionBase<Value>
  | AutoCompleteOptionGroup<Value>;

export type AutoCompleteAsFieldProps<Value extends string> = Partial<
  Pick<
    AntdAutoCompleteProps,
    "allowClear" | "autoFocus" | "defaultActiveFirstOption" | "disabled"
  >
> & {
  options: Array<AutoCompleteOption<Value>>;
};

type AutoCompleteProps<Value extends string> = Required<
  AutoCompleteAsFieldProps<Value>
> & {
  id: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onFilterOptions: AntdAutoCompleteProps["filterOption"];
  placeholder: string;
  value: Value | undefined;
};

export function AutoComplete<Value extends string = string>({
  id,
  allowClear,
  autoFocus,
  disabled,
  defaultActiveFirstOption,
  onBlur,
  onChange,
  onFilterOptions,
  options,
  placeholder,
  value,
}: AutoCompleteProps<Value>): JSX.Element {
  return (
    <AntdAutoComplete
      allowClear={allowClear}
      autoFocus={autoFocus}
      defaultActiveFirstOption={defaultActiveFirstOption || false}
      disabled={disabled}
      filterOption={onFilterOptions}
      id={id}
      onBlur={onBlur}
      onChange={onChange}
      options={options.map((opt) => generateOption(opt))}
      placeholder={placeholder}
      value={typeof value === "string" ? value : ""}
    />
  );
}

export function generateOption<Value extends string = string>(
  option: AutoCompleteOptionBase<Value>
): AutoCompleteOptionBase<Value> & { key: string };
export function generateOption<Value extends string = string>(
  option: AutoCompleteOptionGroup<Value>
): AutoCompleteOptionGroup<Value>;
export function generateOption<Value extends string = string>(
  option: AutoCompleteOption<Value>
): AutoCompleteOption<Value>;
export function generateOption<Value extends string = string>(
  option:
    | AutoCompleteOption<Value>
    | AutoCompleteOptionBase<Value>
    | AutoCompleteOptionGroup<Value>
):
  | AutoCompleteOption<Value>
  | AutoCompleteOptionGroup<Value>
  | (AutoCompleteOptionBase<Value> & { key: string }) {
  if ("options" in option) {
    return {
      ...option,
      /* Customized placeholder option when "options" is empty?
      options:
        option.options.length === 0
          ? [{ disabled: true, label: <em>Não há dados</em>, value: nanoid() }]
          : option.options.map((opt) => generateOption(opt)),
      */
      options: option.options.map((opt) => generateOption(opt)),
    };
  } else {
    return { ...option, key: nanoid() };
  }
}
