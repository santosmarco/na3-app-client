import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import React from "react";

type DocsStdViewPdfButtonProps = {
  onClick: () => void;
  tooltip?: React.ReactNode;
  disabled?: boolean;
};

export function DocsStdViewPdfButton({
  onClick,
  tooltip,
  disabled,
}: DocsStdViewPdfButtonProps): JSX.Element {
  return (
    <Tooltip title={tooltip} visible={tooltip ? undefined : false}>
      <Button
        block={true}
        disabled={disabled}
        icon={<FilePdfOutlined />}
        onClick={onClick}
        type="primary"
      >
        Acessar documento
      </Button>
    </Tooltip>
  );
}
