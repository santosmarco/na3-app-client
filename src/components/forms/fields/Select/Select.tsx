import type { SelectProps as AntdSelectProps, TagProps } from "antd";
import { Tag } from "antd";
import { Select as AntdSelect } from "antd";
import { nanoid } from "nanoid";
import React, { useCallback } from "react";

import { isArray } from "../../../../utils";
import classes from "./Select.module.css";

type SelectValue = string[] | string;

export type SelectOptionBase<OptionValue extends string = string> = {
  label: React.ReactNode;
  labelWhenSelected?: React.ReactNode;
  value: OptionValue;
};

export type SelectOptionGroup<OptionValue extends string = string> = {
  label: React.ReactNode;
  options: SelectOptionBase<OptionValue>[];
};

type SelectOption<OptionValue extends string> =
  | SelectOptionBase<OptionValue>
  | SelectOptionGroup<OptionValue>;

type SelectTagProps = Pick<TagProps, "color" | "style"> & {
  containerStyle?: React.CSSProperties;
};

type RenderTagHandler<Value extends SelectValue> = Exclude<
  AntdSelectProps<Value>["tagRender"],
  undefined
>;

export type SelectAsFieldProps<Value extends SelectValue> = Partial<
  Pick<
    AntdSelectProps<Value>,
    | "allowClear"
    | "autoFocus"
    | "defaultActiveFirstOption"
    | "disabled"
    | "showSearch"
  >
> & {
  multiple?: boolean;
  onTagProps?:
    | ((
        value: Parameters<RenderTagHandler<Value>>[0]["value"]
      ) => SelectTagProps)
    | null;
  options: SelectOption<Value extends Array<string> ? Value[number] : Value>[];
};

type SelectProps<Value extends SelectValue> = Required<
  SelectAsFieldProps<Value>
> & {
  id: string;
  onBlur: () => void;
  onChange: (value: Value) => void;
  onFilterOptions: AntdSelectProps<Value>["filterOption"];
  placeholder: string;
  value: Value | undefined;
};

export function Select<Value extends SelectValue = SelectValue>({
  id,
  autoFocus,
  allowClear,
  disabled,
  multiple,
  onTagProps,
  onBlur,
  onChange,
  placeholder,
  options,
  onFilterOptions,
  defaultActiveFirstOption,
  showSearch,
  value: valueOrValues,
}: SelectProps<Value>): JSX.Element {
  const handleRenderTag: RenderTagHandler<Value> = useCallback(
    ({ value: optionValue, label, closable, onClose }) => {
      return (
        <div
          className={`${classes.LabelWhenSelected} ${classes.CustomTagContainer}`}
          style={onTagProps?.(optionValue).containerStyle}
        >
          <Tag
            closable={closable}
            color={onTagProps?.(optionValue).color}
            onClose={onClose}
            style={{
              marginLeft:
                isArray(valueOrValues) && optionValue === valueOrValues[0]
                  ? 7
                  : undefined,
              marginRight: 3,
              ...onTagProps?.(optionValue).style,
            }}
          >
            {label}
          </Tag>
        </div>
      );
    },
    [onTagProps, valueOrValues]
  );

  return (
    <AntdSelect
      allowClear={allowClear}
      autoFocus={autoFocus}
      defaultActiveFirstOption={defaultActiveFirstOption}
      disabled={disabled}
      filterOption={onFilterOptions}
      id={id}
      mode={multiple ? "multiple" : onTagProps ? "tags" : undefined}
      onBlur={onBlur}
      onChange={onChange}
      optionLabelProp="labelWhenSelected"
      options={options.map((opt) =>
        generateOption(opt, {
          preventLabelWhenSelected: !!(multiple || onTagProps),
        })
      )}
      placeholder={placeholder}
      showSearch={showSearch || multiple || !!onTagProps}
      tagRender={handleRenderTag}
      tokenSeparators={[",", ";", "  "]}
      value={valueOrValues}
    />
  );
}

export function generateOption<OptionValue extends string = string>(
  option: SelectOptionBase<OptionValue>,
  config: { preventLabelWhenSelected: boolean }
): SelectOptionBase<OptionValue> & { key: string };
export function generateOption<OptionValue extends string = string>(
  option: SelectOptionGroup<OptionValue>,
  config: { preventLabelWhenSelected: boolean }
): SelectOptionGroup<OptionValue>;
export function generateOption<OptionValue extends string = string>(
  option: SelectOption<OptionValue>,
  config: { preventLabelWhenSelected: boolean }
): SelectOption<OptionValue>;
export function generateOption<OptionValue extends string = string>(
  option:
    | SelectOption<OptionValue>
    | SelectOptionBase<OptionValue>
    | SelectOptionGroup<OptionValue>,
  config: { preventLabelWhenSelected: boolean }
):
  | SelectOption<OptionValue>
  | SelectOptionGroup<OptionValue>
  | (SelectOptionBase<OptionValue> & { key: string }) {
  if ("options" in option) {
    return {
      ...option,
      options: option.options.map((opt) => generateOption(opt, config)),
    };
  } else {
    return {
      ...option,
      key: nanoid(),
      labelWhenSelected:
        config.preventLabelWhenSelected || !option.labelWhenSelected ? (
          option.label
        ) : (
          <div className={classes.LabelWhenSelected}>
            {option.labelWhenSelected}
          </div>
        ),
    };
  }
}
