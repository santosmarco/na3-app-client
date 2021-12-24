import { ArrowUpOutlined } from "@ant-design/icons";
import { Text } from "@components";
import { useNa3StdDocs } from "@modules/na3-react";
import type { Na3StdDocument } from "@modules/na3-types";
import React, { useMemo } from "react";

type DocsStdTableItemVersionProps = {
  doc: Na3StdDocument;
};

export function DocsStdTableItemVersion({
  doc,
}: DocsStdTableItemVersionProps): JSX.Element {
  const {
    helpers: {
      getDocumentLatestVersion,
      getDocumentLatestApprovedVersion,
      checkDocumentHasBeenReleased,
      checkDocumentIsUpgrading,
    },
  } = useNa3StdDocs();

  const docLatestVersion = useMemo(
    () => getDocumentLatestVersion(doc),
    [getDocumentLatestVersion, doc]
  );

  const docLatestApprovedVersion = useMemo(
    () => getDocumentLatestApprovedVersion(doc),
    [getDocumentLatestApprovedVersion, doc]
  );

  return (
    <>
      <Text>
        {docLatestApprovedVersion
          ? `v.${docLatestApprovedVersion.number}`
          : "—"}
      </Text>

      {checkDocumentHasBeenReleased(doc) &&
        checkDocumentIsUpgrading(doc) &&
        docLatestVersion && (
          <Text italic={true} small={true}>
            {" "}
            (<ArrowUpOutlined />
            v.{docLatestVersion.number})
          </Text>
        )}
    </>
  );
}
