import type { FormItemProps } from "antd";
import { Button, Form } from "antd";
import React from "react";
import { useFormContext } from "react-hook-form";

export type SubmitButtonProps = Pick<
  FormItemProps,
  "labelCol" | "wrapperCol"
> & {
  icon?: React.ReactNode;
  label: string;
  labelWhenLoading: string;
};

const defaultProps: Omit<SubmitButtonProps, "label" | "labelWhenLoading"> = {
  icon: undefined,
};

export function SubmitButton({
  label,
  labelWhenLoading,
  icon,
  labelCol,
  wrapperCol,
}: SubmitButtonProps): JSX.Element {
  const { formState } = useFormContext();

  return (
    <Form.Item
      labelCol={labelCol || { span: 24 }}
      wrapperCol={wrapperCol || { span: 24 }}
    >
      <Button
        block={true}
        htmlType="submit"
        icon={icon}
        loading={formState.isSubmitting}
        type="primary"
      >
        {formState.isSubmitting ? labelWhenLoading : label}
      </Button>
    </Form.Item>
  );
}

SubmitButton.defaultProps = defaultProps;
