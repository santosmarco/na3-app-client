import {
  FileDoneOutlined,
  FileExclamationOutlined,
  FileOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import type { FieldStatus } from "@components";
import { Icon, Overlay } from "@components";
import type { MaybeArray } from "@types";
import { Typography, Upload } from "antd";
import { isArray } from "lodash";
import React, { useCallback } from "react";

import classes from "./FileUpload.module.css";

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
  status?: FieldStatus;
  help?: React.ReactNode;
  hideHintWhenValid?: boolean;
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
  status,
  help,
  hideHintWhenValid,
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
          <Typography.Text className={classes.DraggerIcon}>
            {/* Icon when input is valid */}
            <Icon animated={true} color="success" visible={status === "valid"}>
              <FileDoneOutlined />
            </Icon>
            {/* Icon when input is invalid */}
            <Icon animated={true} color="error" visible={status === "invalid"}>
              <FileExclamationOutlined />
            </Icon>
            {/* Default icon */}
            <Icon
              animated={true}
              color="primary"
              visible={status !== "valid" && status !== "invalid"}
            >
              {getDraggerIcon({ acceptableFileTypes: acceptOnly })}
            </Icon>
          </Typography.Text>

          <p className="ant-upload-text">{help || placeholder}</p>

          {hint && (status !== "valid" || !hideHintWhenValid) && (
            <p className="ant-upload-hint">{hint}</p>
          )}
        </Upload.Dragger>
      </Overlay>
    </div>
  );
}

function getDraggerIcon({
  acceptableFileTypes,
}: {
  acceptableFileTypes: MaybeArray<FileUploadAccept> | null | undefined;
}): JSX.Element {
  if (acceptableFileTypes === "application/pdf") {
    return <FilePdfOutlined />;
  }
  return <FileOutlined />;
}
