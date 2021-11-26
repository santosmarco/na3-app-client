import { Button } from "antd";
import React from "react";

import classes from "./PreviewFooter.module.css";

type PreviewFooterProps = {
  isPrintDisabled?: boolean;
  isSaveDisabled?: boolean;
  onCancel: () => void;
  onPrint: () => void;
  onSave: () => void;
};

const defaultProps: Omit<
  PreviewFooterProps,
  "onCancel" | "onPrint" | "onSave"
> = {
  isPrintDisabled: false,
  isSaveDisabled: false,
};

export function PreviewFooter({
  onCancel,
  onPrint,
  onSave,
  isPrintDisabled,
  isSaveDisabled,
}: PreviewFooterProps): JSX.Element {
  return (
    <div className={classes.Container}>
      <Button onClick={onCancel}>Voltar</Button>

      <div>
        <Button disabled={isSaveDisabled} onClick={onSave}>
          Salvar como PDF
        </Button>

        <Button disabled={isPrintDisabled} onClick={onPrint} type="primary">
          Imprimir
        </Button>
      </div>
    </div>
  );
}

PreviewFooter.defaultProps = defaultProps;
