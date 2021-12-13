import type { DayjsInput } from "@utils";
import { humanizeDuration } from "@utils";
import { Typography } from "antd";
import React from "react";

type AccountLastSeenProps = {
  at: DayjsInput;
};

export function AccountLastSeen({ at }: AccountLastSeenProps): JSX.Element {
  return (
    <Typography.Text italic={true} type="secondary">
      <small>online {humanizeDuration(at)}</small>
    </Typography.Text>
  );
}
