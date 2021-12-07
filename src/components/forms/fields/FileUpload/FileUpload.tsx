import { FileOutlined } from "@ant-design/icons";
import { Overlay } from "@components";
import type { MaybeArray } from "@types";
import { Upload } from "antd";
import { isArray } from "lodash";
import React, { useCallback } from "react";

type UploadFileStatus = "done" | "error" | "removed" | "success" | "uploading";

type FileUploadAccept = "application/pdf";

type OriginFile = Readonly<File & { lastModifiedDate: Date; uid: string }>;

export type UploadFile = {
  error?: unknown;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  name: string;
  originFileObj?: OriginFile;
  percent?: number;
  preview?: string;
  size?: number;
  status?: UploadFileStatus;
  thumbUrl?: string;
  type?: string;
  uid: string;
  url?: string;
};

export type FileUploadAsFieldProps = {
  acceptOnly?: MaybeArray<FileUploadAccept> | null | undefined;
  fileTransform?:
    | ((file: UploadFile, index: number, files: UploadFile[]) => UploadFile)
    | null
    | undefined;
  hint?: React.ReactNode;
  maxCount?: number;
  multiple?: boolean;
};

type FileUploadProps = Required<FileUploadAsFieldProps> & {
  disabled: boolean;
  id: string;
  onBlur: () => void;
  onChange: (files: UploadFile[]) => void;
  placeholder: React.ReactNode;
  value: UploadFile[];
};

export function FileUpload({
  disabled,
  hint,
  id,
  maxCount,
  multiple,
  onBlur,
  onChange,
  placeholder,
  value,
  fileTransform,
  acceptOnly,
}: FileUploadProps): JSX.Element {
  const handleChange = useCallback(
    ({ fileList }: { fileList: UploadFile[] }) => {
      let updatedFileList = [...fileList];

      if (fileTransform) {
        updatedFileList = updatedFileList.map(fileTransform);
      }

      onChange(updatedFileList);
      onBlur();
    },
    [onChange, onBlur, fileTransform]
  );

  const handleRemove = useCallback(
    (file: UploadFile) => {
      const fileIdx = value.indexOf(file);
      const updatedValue = [...value].splice(fileIdx, 1);
      onChange(updatedValue);
    },
    [value, onChange]
  );

  const handleBeforeUpload = useCallback(() => false, []);

  return (
    <div>
      <Overlay visible={disabled}>
        <Upload.Dragger
          accept={
            isArray(acceptOnly) ? acceptOnly.join(",") : acceptOnly || undefined
          }
          beforeUpload={handleBeforeUpload}
          disabled={disabled}
          fileList={value}
          id={id}
          maxCount={maxCount}
          multiple={multiple}
          onChange={handleChange}
          onRemove={handleRemove}
        >
          <p className="ant-upload-drag-icon">
            <FileOutlined />
          </p>

          <p className="ant-upload-text">{placeholder}</p>

          {hint && <p className="ant-upload-hint">{hint}</p>}
        </Upload.Dragger>
      </Overlay>
    </div>
  );
}
