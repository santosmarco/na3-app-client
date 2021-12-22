import { Text } from "@components";
import type { Na3StdDocument } from "@modules/na3-types";
import React from "react";

type DocsStdTableItemTitleProps = {
  doc: Na3StdDocument;
};

export function DocsStdTableItemTitle({
  doc,
}: DocsStdTableItemTitleProps): JSX.Element {
  return (
    <>
      <Text block={true} maxLines={1}>
        {doc.title}
      </Text>

      <Text block={true} italic={true} maxLines={2} type="secondary">
        {doc.description}
      </Text>
    </>
  );
}
