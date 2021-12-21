import type { FieldTooltip } from "@components";
import type { FormItemProps as AntdFormItemProps, TooltipProps } from "antd";
import { Form, Typography } from "antd";
import React, { useMemo } from "react";

import { FieldLabel } from "../FieldLabel/FieldLabel";

type FormItemProps = {
  children?: React.ReactNode;
  description?: React.ReactNode;
  help?: React.ReactNode;
  hidden?: boolean;
  hideOptionalMark?: boolean;
  label?: string;
  labelCol?: AntdFormItemProps["labelCol"];
  labelSpan?: number;
  required?: boolean;
  tooltip?: FieldTooltip;
  wrapperCol?: AntdFormItemProps["wrapperCol"];
};

export function FormItem({
  children,
  label,
  labelCol,
  tooltip: tooltipProp,
  wrapperCol,
  required,
  hidden,
  labelSpan,
  help,
  description,
  hideOptionalMark,
}: FormItemProps): JSX.Element {
  const tooltip = useMemo(() => {
    if (!tooltipProp) {
      return undefined;
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
  }, [tooltipProp]);

  return (
    <Form.Item
      colon={false}
      help={help}
      hidden={hidden}
      label={
        <FieldLabel
          hideOptionalMark={!!hideOptionalMark}
          isOptional={!required}
        >
          {label}
        </FieldLabel>
      }
      labelAlign="left"
      labelCol={labelCol || { span: labelSpan || 24 }}
      required={required ?? true}
      tooltip={tooltip}
      wrapperCol={wrapperCol || { span: 24 - (labelSpan || 0) }}
    >
      {description ? (
        <Typography.Text type="secondary">{description}</Typography.Text>
      ) : (
        children
      )}
    </Form.Item>
  );
}
