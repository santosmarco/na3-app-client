import { Typography } from "antd";
import React from "react";

type AccountRegistrationIdProps = {
  children: string;
};

export function AccountRegistrationId({
  children,
}: AccountRegistrationIdProps): JSX.Element {
  return (
    <Typography.Text italic={true} type="secondary">
      <small>Matrícula nº {children.trim()}</small>
    </Typography.Text>
  );
}
