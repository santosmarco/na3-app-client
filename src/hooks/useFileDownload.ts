import { useCallback, useState } from "react";

type FileDownloadStatus = "done" | "downloading" | "error" | "idle";

type UseFileDownloadReturn = {
  download: (fileUrl: string, fileName: `${string}.${string}`) => Promise<void>;
  error: Error | undefined;
  progress: number;
  progressPercent: number;
  status: FileDownloadStatus;
};

export function useFileDownload(): UseFileDownloadReturn {
  const [status, setStatus] = useState<FileDownloadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<Error>();

  const handleError = useCallback((xhr: XMLHttpRequest): Error => {
    const err = new Error(`${xhr.status}: ${xhr.statusText}`);
    setError(err);
    setStatus("error");
    return err;
  }, []);

  const download = useCallback(
    async (fileUrl: string, fileName: `${string}.${string}`): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        if (status === "downloading") {
          return;
        }
        setStatus("downloading");
        const xhr = new XMLHttpRequest();
        xhr.open("GET", fileUrl, true);
        xhr.responseType = "blob";
        xhr.onload = (): void => {
          if (xhr.status === 200 && xhr.response instanceof Blob) {
            const url = window.URL.createObjectURL(xhr.response);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setStatus("done");
            resolve();
          } else {
            const err = handleError(xhr);
            reject(err);
          }
        };
        xhr.onprogress = (event): void => {
          if (event.lengthComputable) {
            setProgress(event.loaded);
            setProgressPercent(Math.round((event.loaded / event.total) * 100));
          }
        };
        xhr.onerror = (): void => {
          const err = handleError(xhr);
          reject(err);
        };
        xhr.send();
      });
    },
    [status, handleError]
  );

  return { status, progress, progressPercent, error, download };
}
