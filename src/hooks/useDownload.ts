import { useCallback, useEffect, useState } from "react";

import { useCursor } from "./useCursor";

type UseDownloadReturn = {
  download: (encodedUri: string, fileName: string) => Promise<void>;
  isDownloading: boolean;
};

export function useDownload(): UseDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);

  const [cursor, setCursor] = useCursor();

  const download = useCallback(
    (encodedUri: string, fileName: string): Promise<void> => {
      setIsDownloading(true);

      return new Promise<void>((resolve) => {
        const anchorEl = document.createElement("a");

        anchorEl.setAttribute("href", encodedUri);
        anchorEl.setAttribute("download", fileName);

        document.body.appendChild(anchorEl); // Required for FF

        anchorEl.click();

        resolve();
      }).then(() => {
        setIsDownloading(false);
      });
    },
    []
  );

  useEffect(() => {
    if (isDownloading && cursor !== "wait") {
      setCursor("wait");
    } else if (!isDownloading && cursor !== "default") {
      setCursor("default");
    }
  }, [isDownloading, cursor, setCursor]);

  return { isDownloading, download };
}
