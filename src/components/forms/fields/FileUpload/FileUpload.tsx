import { FileOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadChangeParam, UploadFile } from "antd/lib/upload/interface";
import firebase from "firebase";
import React, { useCallback, useEffect, useState } from "react";

type FileUploadProps = {
  disabled?: boolean;
  fileNameTransform?: (fileName: string) => string;
  folderPath: string;
  hint?: React.ReactNode;
  maxCount?: number;
  multiple?: boolean;
  onChange?: (files: UploadFile[]) => void;
};

export function FileUpload({
  hint,
  folderPath,
  fileNameTransform,
  multiple,
  maxCount,
  disabled,
  onChange,
}: FileUploadProps): JSX.Element {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const getUploadFileName = useCallback(
    (fileName: string) => {
      const fileExtension = /\.[^/.]+$/.exec(fileName)?.[0] ?? "";
      const fileNameWithoutExt = fileName.replace(fileExtension, "");
      const uploadFileName = `${
        fileNameTransform?.(fileNameWithoutExt) || fileNameWithoutExt
      }${fileExtension}`;

      return uploadFileName;
    },
    [fileNameTransform]
  );

  const getFbStorageRef = useCallback(
    (rawFileName: string) => {
      const formattedFolderPath = folderPath
        .split("/")
        .map((pathChunk) => pathChunk.trim())
        .filter((pathChunk) => !!pathChunk)
        .join("/");

      const fbStorageRef = firebase
        .storage()
        .ref(`${formattedFolderPath}/${getUploadFileName(rawFileName)}`);

      return fbStorageRef;
    },
    [folderPath, getUploadFileName]
  );

  const updateFile = useCallback(
    (fileUid: string, update: Partial<Omit<UploadFile, "uid">>) => {
      const targetFile = files.find((f) => f.uid === fileUid);
      const targetFileIdx = files.findIndex((f) => f.uid === fileUid);

      if (targetFile) {
        setFiles((currFileList) => {
          const beforeTarget = currFileList.slice(0, targetFileIdx);
          const afterTarget = currFileList.slice(targetFileIdx + 1);

          if (update.status === "removed") {
            return [...beforeTarget, ...afterTarget];
          }
          return [
            ...beforeTarget,
            { ...targetFile, ...update },
            ...afterTarget,
          ];
        });
      }
    },
    [files]
  );

  const handleChange = useCallback(
    ({ file, fileList }: UploadChangeParam) => {
      const fbStorageRef = getFbStorageRef(file.name);

      if (!file.originFileObj) {
        file.status = "error";
      } else {
        file.status = "uploading";

        const uploadTask = fbStorageRef.put(file.originFileObj, {
          contentType: file.type,
        });

        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            const fileProgress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            updateFile(file.uid, { percent: fileProgress });
          },
          (error) => {
            updateFile(file.uid, { status: "error", error: error.message });
          },
          () => {
            updateFile(file.uid, { status: "success", error: null });
          }
        );
      }

      setFiles(fileList);
    },
    [getFbStorageRef, updateFile]
  );

  const handleRemove = useCallback(
    async (file: UploadFile) => {
      const fbStorageRef = getFbStorageRef(file.name);
      await fbStorageRef.delete();

      updateFile(file.uid, { status: "removed" });

      return false;
    },
    [getFbStorageRef, updateFile]
  );

  console.log(files);

  useEffect(() => {
    onChange?.(files);
  }, [onChange, files]);

  return (
    <Upload.Dragger
      disabled={disabled}
      fileList={files}
      maxCount={maxCount}
      multiple={multiple}
      onChange={handleChange}
      onRemove={handleRemove}
    >
      <p className="ant-upload-drag-icon">
        <FileOutlined />
      </p>

      <p className="ant-upload-text">Clique ou arraste um arquivo para cá</p>

      {hint && <p className="ant-upload-hint">{hint}</p>}
    </Upload.Dragger>
  );
}
