import useMask from "@ryuuji3/react-mask-hook";
import type { InputProps } from "antd";
import { Input } from "antd";
import React from "react";

export type InputMaskProps = Required<
  Pick<
    InputProps,
    | "addonAfter"
    | "addonBefore"
    | "allowClear"
    | "autoFocus"
    | "disabled"
    | "id"
    | "prefix"
    | "suffix"
  >
> & {
  mask: Array<RegExp | string>;
  maskPlaceholder: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string;
};

export function InputMask({
  addonAfter,
  addonBefore,
  allowClear,
  disabled,
  id,
  autoFocus,
  prefix,
  suffix,
  mask,
  maskPlaceholder,
  onBlur,
  onChange,
  value: valueProp,
}: InputMaskProps): JSX.Element {
  const {
    "data-value": dataValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    placeholder,
    value,
  } = useMask({
    mask,
    onChange,
    placeholder: maskPlaceholder,
    value: valueProp,
  });

  return (
    <Input
      addonAfter={addonAfter}
      addonBefore={addonBefore}
      allowClear={allowClear}
      autoComplete="off"
      autoFocus={autoFocus}
      data-value={dataValue}
      disabled={disabled}
      id={id}
      onBlur={onBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
      prefix={prefix}
      suffix={suffix}
      value={value}
    />
  );
}
