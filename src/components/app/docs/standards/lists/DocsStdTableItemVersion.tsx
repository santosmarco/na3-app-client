import { Text } from "@components";
import type { Na3StdDocumentVersion } from "@modules/na3-types";
import React from "react";

type DocsStdTableItemVersionProps = {
  docVersion: Na3StdDocumentVersion | undefined;
  fallback?: React.ReactNode;
};

export function DocsStdTableItemVersion({
  docVersion,
  fallback,
}: DocsStdTableItemVersionProps): JSX.Element {
  return (
    <Text italic={true}>
      {docVersion ? `v.${docVersion.number}` : fallback || "—"}
    </Text>
  );
}
