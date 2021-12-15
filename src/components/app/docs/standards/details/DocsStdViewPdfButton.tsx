import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

type DocsStdViewPdfButtonProps = {
  onClick: () => void;
};

export function DocsStdViewPdfButton({
  onClick,
}: DocsStdViewPdfButtonProps): JSX.Element {
  return (
    <Button icon={<FilePdfOutlined />} onClick={onClick} type="primary">
      Acessar documento
    </Button>
  );
}
