import { Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React from "react";

type AccountLastSeenProps = {
  at: Dayjs;
};

export function AccountLastSeen({ at }: AccountLastSeenProps): JSX.Element {
  return (
    <Typography.Text italic={true} type="secondary">
      <small>
        online {dayjs.duration(at.clone().diff(dayjs())).humanize(true)}
      </small>
    </Typography.Text>
  );
}
