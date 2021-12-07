import { DocsStdTypeTag } from "@components";
import type {
  Na3StdDocumentStatus,
  Na3StdDocumentTypeId,
} from "@modules/na3-types";
import React from "react";

import classes from "./DocsStdCardHeader.module.css";
import { DocsStdStatusBadge } from "./DocsStdStatusBadge";

type DocsStdCardHeaderProps = {
  docStatus: Na3StdDocumentStatus;
  docType: Na3StdDocumentTypeId;
};

export function DocsStdCardHeader({
  docStatus,
  docType,
}: DocsStdCardHeaderProps): JSX.Element {
  return (
    <div className={classes.Header}>
      <DocsStdStatusBadge status={docStatus} />
      <DocsStdTypeTag short={true} type={docType} />
    </div>
  );
}
