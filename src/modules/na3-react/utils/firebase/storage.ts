import type { StorageReference } from "firebase/storage";
import { getStorage, ref } from "firebase/storage";

import type { ConfigEnvironment } from "../../types";

type FolderId = "docs-std";

type FolderOptions = { forceProduction?: boolean };

export function resolveFolderId(
  folderId: FolderId,
  environment: ConfigEnvironment,
  options?: FolderOptions
): string {
  return environment === "production" || options?.forceProduction
    ? folderId
    : `TEST-${folderId}`;
}

export function getFolder(
  folderId: FolderId,
  environment: ConfigEnvironment,
  options?: FolderOptions
): StorageReference {
  return ref(getStorage(), resolveFolderId(folderId, environment, options));
}
