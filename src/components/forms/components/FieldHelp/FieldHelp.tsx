import { LoadingOutlined } from "@ant-design/icons";
import type { TypographyProps } from "antd";
import { Typography } from "antd";
import React, { useMemo } from "react";

import type { FieldStatus } from "../../FormField/FormField";
import classes from "./FieldHelp.module.css";

export type FieldHelpProps = {
  contentWhenDisabled: React.ReactNode | undefined;
  contentWhenLoading: React.ReactNode | undefined;
  contentWhenValid: React.ReactNode | undefined;
  defaultContent: React.ReactNode | undefined;
  error: string | undefined;
  fieldStatus: FieldStatus;
  isDisabled: boolean;
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
  isDisabled,
  contentWhenDisabled,
}: FieldHelpProps): JSX.Element | null {
  const textType = useMemo(
    (): React.ComponentProps<TypographyProps["Text"]>["type"] =>
      fieldStatus === "invalid"
        ? "danger"
        : fieldStatus === "valid"
        ? "success"
        : fieldStatus === "loading"
        ? undefined
        : "secondary",
    [fieldStatus]
  );

  const contentWhenLoading = useMemo(
    () => (isFormSubmitting ? "Validando..." : contentWhenLoadingProp),
    [isFormSubmitting, contentWhenLoadingProp]
  );

  if (isHidden) return null;

  if (!isFormSubmitting && isDisabled) {
    return (
      <Typography.Text type={textType}>{contentWhenDisabled}</Typography.Text>
    );
  }

  switch (fieldStatus) {
    case "loading":
      return (
        <Typography.Text className={classes.Loading} type={textType}>
          <LoadingOutlined /> {contentWhenLoading || "Carregando..."}
        </Typography.Text>
      );
    case "invalid":
      return (
        <Typography.Text type={textType}>
          {error || "Campo inválido"}
        </Typography.Text>
      );
    case "valid":
      return (
        <Typography.Text type={textType}>
          {contentWhenValid || defaultContent || "Parece bom!"}
        </Typography.Text>
      );
    case "untouched":
    default:
      return defaultContent ? (
        <Typography.Text type={textType}>{defaultContent}</Typography.Text>
      ) : null;
  }
}
