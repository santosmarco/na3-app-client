import { FileOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import React from "react";

type FileUploadProps = {
  hint?: React.ReactNode;
};

export function FileUpload({ hint }: FileUploadProps): JSX.Element {
  return (
    <Upload.Dragger>
      <p className="ant-upload-drag-icon">
        <FileOutlined />
      </p>

      <p className="ant-upload-text">Clique ou arraste um arquivo para cá</p>

      {hint && <p className="ant-upload-hint">{hint}</p>}
    </Upload.Dragger>
  );
}
