import { CheckOutlined, WarningOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React from "react";

type PwdChecklistItemProps = {
  children: string;
  isValid: boolean;
};

export function PwdChecklistItem({
  children,
  isValid,
}: PwdChecklistItemProps): JSX.Element {
  return (
    <div>
      <Typography.Text type={isValid ? "success" : "warning"}>
        {isValid ? <CheckOutlined /> : <WarningOutlined />}
      </Typography.Text>{" "}
      <Typography.Text strong={isValid} type={isValid ? "success" : "warning"}>
        {children}
      </Typography.Text>
    </div>
  );
}
