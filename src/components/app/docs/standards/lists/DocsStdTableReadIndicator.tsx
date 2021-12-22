import type { IconSize, IconSpace } from "@components";
import { FeedbackIcon } from "@components";
import React from "react";

type DocsStdTableReadIndicatorProps = {
  hideLabel?: boolean;
  iconSize?: IconSize;
  space?: IconSpace;
  userHasAcknowledged: boolean;
};

export function DocsStdTableReadIndicator({
  userHasAcknowledged,
  iconSize,
  space,
  hideLabel,
}: DocsStdTableReadIndicatorProps): JSX.Element {
  return (
    <FeedbackIcon
      size={iconSize}
      space={space}
      type={userHasAcknowledged ? "success" : "fail"}
    >
      {!hideLabel && (userHasAcknowledged ? "Lido" : "Não lido")}
    </FeedbackIcon>
  );
}
