import type { FormItemProps as AntdFormItemProps } from "antd";
import { Form } from "antd";
import React from "react";

type FormItemProps = {
  children?: React.ReactNode;
  help?: React.ReactNode;
  hidden?: boolean;
  label?: string;
  labelCol?: AntdFormItemProps["labelCol"];
  labelSpan?: number;
  required?: boolean;
  tooltip?: AntdFormItemProps["tooltip"];
  wrapperCol?: AntdFormItemProps["wrapperCol"];
};

export function FormItem({
  children,
  label,
  labelCol,
  tooltip,
  wrapperCol,
  required,
  hidden,
  labelSpan,
  help,
}: FormItemProps): JSX.Element {
  return (
    <Form.Item
      colon={false}
      help={help}
      hidden={hidden}
      label={label}
      labelAlign="left"
      labelCol={labelCol || (labelSpan && { span: labelSpan }) || { span: 24 }}
      required={required ?? true}
      tooltip={tooltip}
      wrapperCol={
        wrapperCol || (labelSpan && { span: 24 - labelSpan }) || { span: 24 }
      }
    >
      {children}
    </Form.Item>
  );
}
