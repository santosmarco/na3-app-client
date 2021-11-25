import { LoadingOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React, { useMemo } from "react";

import type { FieldStatus } from "../../FormField/FormField";
import classes from "./FieldHelp.module.css";

type FieldHelpProps = {
  contentWhenLoading: React.ReactNode | undefined;
  contentWhenValid: React.ReactNode | undefined;
  defaultContent: React.ReactNode | undefined;
  error: string | undefined;
  fieldStatus: FieldStatus;
  isFormSubmitting: boolean;
  isHidden: boolean;
};

export function FieldHelp({
  contentWhenLoading: contentWhenLoadingProp,
  contentWhenValid,
  defaultContent,
  error,
  fieldStatus,
  isFormSubmitting,
  isHidden,
}: FieldHelpProps): JSX.Element | null {
  const contentWhenLoading = useMemo(
    () => (isFormSubmitting ? "Validando..." : contentWhenLoadingProp),
    [isFormSubmitting, contentWhenLoadingProp]
  );

  if (isHidden) return null;

  switch (fieldStatus) {
    case "loading":
      return (
        <Typography.Text className={classes.Loading}>
          <LoadingOutlined /> {contentWhenLoading || "Carregando..."}
        </Typography.Text>
      );
    case "invalid":
      return (
        <Typography.Text type="danger">
          {error || "Campo inválido"}
        </Typography.Text>
      );
    case "valid":
      return (
        <Typography.Text type="success">
          {contentWhenValid || defaultContent || "Parece bom!"}
        </Typography.Text>
      );
    case "untouched":
    default:
      return (
        <Typography.Text type="secondary">{defaultContent}</Typography.Text>
      );
  }
}
