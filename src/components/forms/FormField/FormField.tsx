// Here we can disable ESLint because FormField's props depends heavily on its
// type.
/* eslint-disable react/destructuring-assignment */

import { isTouchDevice, listStr, parseStringId } from "@utils";
import type {
  FormItemProps,
  InputProps,
  RadioChangeEvent,
  SwitchProps,
  TooltipProps,
} from "antd";
import { Form, Input, Radio, Switch } from "antd";
import { isArray } from "lodash";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";

import { FieldHelp } from "../components/FieldHelp/FieldHelp";
import { FieldLabel } from "../components/FieldLabel/FieldLabel";
import { FieldPreSuffix } from "../components/FieldPreSuffix/FieldPreSuffix";
import type { AutoCompleteAsFieldProps } from "../fields/AutoComplete/AutoComplete";
import { AutoComplete } from "../fields/AutoComplete/AutoComplete";
import type {
  FileUploadAsFieldProps,
  UploadFile,
} from "../fields/FileUpload/FileUpload";
import { FileUpload } from "../fields/FileUpload/FileUpload";
import type { InputDateAsFieldProps } from "../fields/InputDate/InputDate";
import { InputDate } from "../fields/InputDate/InputDate";
import { InputMask } from "../fields/InputMask/InputMask";
import type { SelectAsFieldProps } from "../fields/Select/Select";
import { Select } from "../fields/Select/Select";
import classes from "./FormField.module.css";

type FieldType =
  | "autoComplete"
  | "date"
  | "file"
  | "input"
  | "mask"
  | "number"
  | "password"
  | "radio"
  | "select"
  | "switch"
  | "textArea";

type FieldValue = string[] | UploadFile[] | boolean | string;

export type FieldStatus = "invalid" | "loading" | "untouched" | "valid";

export type FieldTooltip =
  | string
  | {
      arrowPointAtCenter?: boolean;
      content: React.ReactNode;
      icon?: React.ReactNode;
      placement?: TooltipProps["placement"];
    };

type InputBaseOptionalProps = Partial<
  Pick<
    InputProps,
    | "addonAfter"
    | "addonBefore"
    | "allowClear"
    | "maxLength"
    | "prefix"
    | "suffix"
  >
>;

type InputTextAreaOptionalProps = Omit<
  InputBaseOptionalProps,
  "addonAfter" | "addonBefore" | "prefix" | "suffix"
> & {
  rows?: { max?: number; min?: number };
};

type InputNumberOptionalProps = InputBaseOptionalProps & {
  max?: number;
  min?: number;
};

type SwitchOptionalProps = Partial<
  Pick<SwitchProps, "checkedChildren" | "unCheckedChildren">
>;

type FormFieldBaseProps<Type extends FieldType, Value extends FieldValue> = {
  autoFocus?: boolean;
  autoUpperCase?: boolean;
  defaultHelp?: React.ReactNode;
  defaultValue?: Value | undefined;
  disabled?: boolean;
  forceValidation?: boolean;
  helpWhenDisabled?: React.ReactNode;
  helpWhenLoading?: React.ReactNode;
  helpWhenValid?: React.ReactNode | ((value: Value) => React.ReactNode);
  hidden?: boolean;
  hideHelpWhenValid?: boolean;
  hideOptionalMark?: boolean;
  isLoading?: boolean;
  labelCol?: FormItemProps["labelCol"];
  labelSpan?: number;
  max?: Type extends "number" ? number : never;
  min?: Type extends "number" ? number : never;
  noDecimal?: Type extends "number" ? boolean : never;
  onBlur?: (value: Value) => void;
  onValueChange?: (value: Value) => void;
  placeholder?: string;
  required?: boolean;
  sortValues?: Type extends "select" ? (a: string, b: string) => number : never;
  tooltip?: FieldTooltip | null;
  type: Type;
  wrapperCol?: FormItemProps["wrapperCol"];
};

export type FormFieldProps<SelectValue extends string[] | string> = {
  label: string;
  name: string;
  rules: Exclude<UseControllerProps["rules"], undefined> | null;
} & (
  | (AutoCompleteAsFieldProps<
      SelectValue extends string[] ? SelectValue[number] : SelectValue
    > &
      FormFieldBaseProps<"autoComplete", SelectValue>)
  | (FileUploadAsFieldProps & FormFieldBaseProps<"file", UploadFile[]>)
  | (FormFieldBaseProps<"date", string> & InputDateAsFieldProps)
  | (FormFieldBaseProps<"input", string> & InputBaseOptionalProps)
  | (FormFieldBaseProps<"mask", string> &
      InputBaseOptionalProps & {
        mask: Array<RegExp | string>;
        maskPlaceholder?: string | null;
      })
  | (FormFieldBaseProps<"number", string> & InputNumberOptionalProps)
  | (FormFieldBaseProps<"password", string> & InputBaseOptionalProps)
  | (FormFieldBaseProps<"radio", string> & {
      options: Array<{ label: React.ReactNode; value: string }>;
    })
  | (FormFieldBaseProps<"select", SelectValue> &
      SelectAsFieldProps<SelectValue>)
  | (FormFieldBaseProps<"switch", boolean> & SwitchOptionalProps)
  | (FormFieldBaseProps<"textArea", string> & InputTextAreaOptionalProps)
);

const defaultProps = {
  autoFocus: false,
  autoUpperCase: false,
  defaultHelp: undefined,
  disabled: false,
  helpWhenLoading: undefined,
  helpWhenValid: undefined,
  hidden: false,
  hideHelpWhenValid: false,
  isLoading: false,
  labelCol: undefined,
  labelSpan: undefined,
  placeholder: undefined,
  required: true,
  tooltip: undefined,
  wrapperCol: undefined,
};

export function FormField<SelectValue extends string = string>(
  props: FormFieldProps<SelectValue>
): JSX.Element {
  const {
    // Required props
    label,
    name: nameProp,
    type,
    rules,
    // Common optional props
    defaultValue,
    autoFocus,
    autoUpperCase,
    defaultHelp,
    disabled: disabledProp,
    forceValidation,
    hidden,
    hideHelpWhenValid,
    hideOptionalMark,
    isLoading,
    labelCol,
    labelSpan,
    helpWhenLoading,
    helpWhenValid,
    helpWhenDisabled,
    required,
    placeholder: placeholderProp,
    tooltip: tooltipProp,
    wrapperCol,
    // Type-based props
    // number
    max,
    min,
    noDecimal,
    // select
    sortValues,
    // Value-based props
    onBlur,
    onValueChange,
  } = props;

  const {
    field: { name, onChange, onBlur: onFieldBlur, ...field },
    fieldState: { error, isTouched, invalid },
    formState: { isSubmitting },
  } = useController({
    name: nameProp,
    rules: rules
      ? {
          ...rules,
          required:
            required &&
            (typeof rules.required === "string"
              ? rules.required
              : "Campo obrigatório"),
        }
      : undefined,
    shouldUnregister: true,
    defaultValue,
  });

  const value = useMemo(
    (): FieldValue => field.value as FieldValue,
    [field.value]
  );

  const [prevValue, setPrevValue] = useState(value);

  const hasValue = useMemo(
    () => (isArray(value) ? !!value[0] : !!value),
    [value]
  );

  const status = useMemo((): FieldStatus => {
    if (isLoading) return "loading";
    if (error?.message || invalid) return "invalid";
    if (isTouched && hasValue) return "valid";
    return "untouched";
  }, [isLoading, error?.message, invalid, isTouched, hasValue]);

  const handleChange = useCallback(
    (
      eventOrValue:
        | FieldValue
        | RadioChangeEvent
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | null
        | undefined
    ) => {
      function isInputChangeEvent(
        param: unknown
      ): param is React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> {
        return typeof param === "object" && param !== null && "target" in param;
      }

      let extractedValue = isInputChangeEvent(eventOrValue)
        ? eventOrValue.target.value
        : eventOrValue;

      if (autoUpperCase) {
        if (typeof extractedValue === "string") {
          extractedValue = extractedValue.toUpperCase();
        } else if (isArray(extractedValue)) {
          if (isUploadFileArray(extractedValue)) {
            extractedValue = extractedValue.map((v) => ({
              ...v,
              fileName: v.fileName?.toUpperCase(),
            }));
          } else {
            extractedValue = extractedValue.map((v) => v.toUpperCase());
          }
        }
      }

      if (type === "number" && typeof extractedValue === "string") {
        if (
          (noDecimal && !/^\d*$/.test(extractedValue)) ||
          !/^\d*(?:,\d*)?$/.test(extractedValue)
        ) {
          return;
        }

        if (
          (min && Number.parseFloat(extractedValue.replace(",", ".")) <= min) ||
          (max && Number.parseFloat(extractedValue.replace(",", ".")) > max)
        ) {
          if (/,.?$/.test(extractedValue)) {
            extractedValue = extractedValue.slice(
              0,
              extractedValue.indexOf(",")
            );
          } else {
            return;
          }
        }
      }

      if (isArray(extractedValue) && sortValues) {
        if (isUploadFileArray(extractedValue)) {
          extractedValue = [...extractedValue].sort((a, b) =>
            sortValues(a.fileName || a.name, b.fileName || b.name)
          );
        } else {
          extractedValue = [...extractedValue].sort((a, b) => sortValues(a, b));
        }
      }

      onChange(extractedValue);
    },
    [onChange, type, autoUpperCase, noDecimal, min, max, sortValues]
  );

  const handleBlur = useCallback(() => {
    onFieldBlur();
    onBlur?.(value as never);
  }, [onFieldBlur, onBlur, value]);

  const handleFilterSelectOptions = useCallback(
    (input: string, option?: { label?: unknown; value?: unknown }): boolean => {
      const compareTo =
        option &&
        (typeof option.label === "string"
          ? option.label
          : typeof option.value === "string"
          ? option.value
          : undefined);

      return (
        compareTo?.toUpperCase().trim().includes(input.toUpperCase().trim()) ||
        false
      );
    },
    []
  );

  const disabled = useMemo(
    (): boolean => disabledProp || isLoading || isSubmitting,
    [disabledProp, isLoading, isSubmitting]
  );

  useEffect(() => {
    if (forceValidation) {
      if (disabled) {
        return;
      }
      onFieldBlur();
      return;
    }

    if (
      (isTouched || hasValue) &&
      (type === "autoComplete" ||
        type === "select" ||
        type === "radio" ||
        type === "date")
    ) {
      onFieldBlur();
    }

    if (prevValue !== value) {
      setPrevValue(value);
      onValueChange?.(value as never);
    }
  }, [
    forceValidation,
    disabled,
    value,
    prevValue,
    type,
    isTouched,
    hasValue,
    onValueChange,
    onFieldBlur,
  ]);

  const placeholder = useMemo((): string => {
    if (placeholderProp) return placeholderProp;
    if (disabled) return "";
    else {
      const verb = isTouchDevice() ? "Toque" : "Clique";
      switch (type) {
        case "input":
        case "password":
        case "textArea":
        case "number":
          return `${verb} para preencher`;
        case "select":
          return `${verb} para selecionar`;
        case "autoComplete":
        case "date":
          return `${verb} para preencher/selecionar`;
        case "mask":
        case "radio":
        case "switch":
          return "";
        case "file":
          return isTouchDevice()
            ? "Toque para selecionar um arquivo"
            : "Clique ou arraste um arquivo para cá";
      }
    }
  }, [placeholderProp, disabled, type]);

  const handleTooltipFileExtensionTransform = useCallback(
    (ext: string) => <strong>{parseStringId(ext)}</strong>,
    []
  );

  const tooltip = useMemo((): TooltipProps | undefined => {
    if (tooltipProp === null) {
      return;
    }

    const defaultTooltip: Omit<TooltipProps, "overlay"> = {
      arrowPointAtCenter: true,
      placement: "topLeft",
    };

    if (typeof tooltipProp === "string") {
      return { ...defaultTooltip, title: tooltipProp };
    }
    if (typeof tooltipProp === "object") {
      return { ...defaultTooltip, ...tooltipProp, title: tooltipProp.content };
    }

    if (type === "file" && "acceptOnly" in props && props.acceptOnly) {
      return {
        ...defaultTooltip,
        title: (
          <>
            Arquivos suportados:{" "}
            {listStr(props.acceptOnly, {
              connective: "and",
              itemTransform: handleTooltipFileExtensionTransform,
            })}
          </>
        ),
      };
    }
  }, [tooltipProp, type, handleTooltipFileExtensionTransform, props]);

  const labelComponent = useMemo(
    (): JSX.Element => (
      <FieldLabel hideOptionalMark={!!hideOptionalMark} isOptional={!required}>
        {label}
      </FieldLabel>
    ),
    [required, label, hideOptionalMark]
  );

  const helpComponent = useMemo(
    (): JSX.Element => (
      <FieldHelp
        contentWhenDisabled={helpWhenDisabled}
        contentWhenLoading={helpWhenLoading}
        contentWhenValid={
          typeof helpWhenValid === "function"
            ? (helpWhenValid(value as never) as React.ReactNode)
            : helpWhenValid
        }
        defaultContent={
          defaultHelp || (type === "file" && status !== "valid" && placeholder)
        }
        error={error?.message}
        fieldStatus={status}
        isDisabled={disabled}
        isFormSubmitting={isSubmitting}
        isHidden={status === "valid" ? !!hideHelpWhenValid : false}
      />
    ),
    [
      type,
      defaultHelp,
      error?.message,
      status,
      isSubmitting,
      disabled,
      hideHelpWhenValid,
      helpWhenLoading,
      helpWhenValid,
      helpWhenDisabled,
      value,
      placeholder,
    ]
  );

  const fieldComponent = useMemo((): JSX.Element => {
    switch (type) {
      case "input":
      case "number":
        return (
          <Input
            addonAfter={props.addonAfter}
            addonBefore={props.addonBefore}
            allowClear={props.allowClear}
            autoFocus={autoFocus}
            disabled={disabled}
            id={name}
            maxLength={props.maxLength}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            prefix={
              <FieldPreSuffix isPrefix={true}>{props.prefix}</FieldPreSuffix>
            }
            suffix={<FieldPreSuffix>{props.suffix}</FieldPreSuffix>}
            value={typeof value === "string" ? value : ""}
          />
        );
      case "password":
        return (
          <Input.Password
            addonAfter={props.addonAfter}
            addonBefore={props.addonBefore}
            allowClear={props.allowClear}
            autoFocus={autoFocus}
            disabled={disabled}
            id={name}
            maxLength={props.maxLength}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            prefix={
              <FieldPreSuffix isPrefix={true}>{props.prefix}</FieldPreSuffix>
            }
            suffix={<FieldPreSuffix>{props.suffix}</FieldPreSuffix>}
            value={typeof value === "string" ? value : ""}
          />
        );
      case "textArea":
        return (
          <Input.TextArea
            allowClear={props.allowClear}
            autoFocus={autoFocus}
            autoSize={{
              maxRows: props.rows?.max,
              minRows: props.rows?.min || 3,
            }}
            disabled={disabled}
            id={name}
            maxLength={props.maxLength}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            value={typeof value === "string" ? value : ""}
          />
        );
      case "mask":
        return (
          <InputMask
            addonAfter={props.addonAfter || null}
            addonBefore={props.addonBefore || null}
            allowClear={props.allowClear || false}
            autoFocus={autoFocus || false}
            disabled={disabled}
            id={name}
            mask={props.mask}
            maskPlaceholder={props.maskPlaceholder || "_"}
            onBlur={handleBlur}
            onChange={handleChange}
            prefix={
              <FieldPreSuffix isPrefix={true}>{props.prefix}</FieldPreSuffix>
            }
            suffix={<FieldPreSuffix>{props.suffix}</FieldPreSuffix>}
            value={typeof value === "string" ? value : ""}
          />
        );
      case "autoComplete":
        return (
          <AutoComplete
            allowClear={props.allowClear ?? true}
            autoFocus={autoFocus || false}
            defaultActiveFirstOption={props.defaultActiveFirstOption || false}
            disabled={disabled}
            id={name}
            onBlur={handleBlur}
            onChange={handleChange}
            onFilterOptions={handleFilterSelectOptions}
            options={props.options}
            placeholder={placeholder}
            value={typeof value === "string" ? value : ""}
          />
        );
      case "select":
        return (
          <Select
            allowClear={props.allowClear ?? true}
            autoFocus={autoFocus || false}
            defaultActiveFirstOption={props.defaultActiveFirstOption ?? true}
            disabled={disabled}
            id={name}
            multiple={props.multiple || false}
            onBlur={handleBlur}
            onChange={handleChange}
            onFilterOptions={handleFilterSelectOptions}
            onTagProps={props.onTagProps || null}
            options={props.options}
            placeholder={placeholder}
            showSearch={props.showSearch || false}
            value={
              (value !== true && !isUploadFileArray(value) && value) ||
              undefined
            }
          />
        );
      case "radio":
        return (
          <Radio.Group
            className={classes.RadioGroup}
            id={name}
            onChange={handleChange}
            value={typeof value === "string" ? value : ""}
          >
            {props.options.map(({ value, label }) => (
              <Radio.Button
                key={nanoid()}
                style={{ width: `${100 / props.options.length}%` }}
                value={value}
              >
                {label}
              </Radio.Button>
            ))}
          </Radio.Group>
        );
      case "switch":
        return (
          <div className={classes.SwitchContainer}>
            <Switch
              checked={!!value}
              checkedChildren={props.checkedChildren}
              disabled={disabled}
              onChange={handleChange}
              unCheckedChildren={props.unCheckedChildren}
            />
          </div>
        );
      case "date":
        return (
          <InputDate
            allowClear={props.allowClear || false}
            autoFocus={autoFocus || false}
            disabled={disabled}
            disallowFutureDates={props.disallowFutureDates || false}
            disallowPastDates={props.disallowPastDates || false}
            format={props.format || "DD/MM/YYYY"}
            id={name}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            value={typeof value === "string" ? value : ""}
          />
        );
      case "file":
        return (
          <FileUpload
            acceptOnly={props.acceptOnly || null}
            disabled={isSubmitting ? disabledProp || false : disabled}
            fileTransform={props.fileTransform || null}
            help={helpComponent}
            hideHintWhenValid={props.hideHintWhenValid ?? true}
            hint={props.hint || null}
            id={name}
            maxCount={props.maxCount || 1}
            multiple={props.multiple || false}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            status={status}
            value={isUploadFileArray(value) ? value : []}
          />
        );
    }
  }, [
    name,
    type,
    value,
    status,
    helpComponent,
    handleChange,
    handleBlur,
    handleFilterSelectOptions,
    autoFocus,
    disabled,
    disabledProp,
    placeholder,
    isSubmitting,
    props,
  ]);

  return (
    <Form.Item
      colon={false}
      hasFeedback={type !== "file"}
      help={type !== "file" && helpComponent}
      hidden={hidden}
      htmlFor={name}
      label={labelComponent}
      labelAlign="left"
      labelCol={labelCol || { span: labelSpan || 24 }}
      required={required}
      tooltip={tooltip}
      validateStatus={
        status === "loading"
          ? "validating"
          : status === "invalid"
          ? "error"
          : status === "valid"
          ? "success"
          : undefined
      }
      wrapperCol={wrapperCol || { span: 24 - (labelSpan || 0) }}
    >
      {fieldComponent}
    </Form.Item>
  );
}

FormField.defaultProps = defaultProps;

function isUploadFileArray(value: FieldValue): value is UploadFile[] {
  if (!isArray(value)) {
    return false;
  }
  return !value.some((v) => typeof v === "string");
}
