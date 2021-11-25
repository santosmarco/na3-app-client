import type { TimelineProps as AntdTimelineProps } from "antd";
import { Timeline as AntdTimeline } from "antd";
import { nanoid } from "nanoid";
import React from "react";

import classes from "./Timeline.module.css";
import type { TimelineItemProps } from "./TimelineItem";
import { TimelineItem } from "./TimelineItem";

type TimelineProps = Partial<Pick<AntdTimelineProps, "mode">> & {
  items: TimelineItemProps[];
};

export function Timeline({ mode, items }: TimelineProps): JSX.Element {
  return (
    <AntdTimeline className={classes.Timeline} mode={mode || "left"}>
      {[...items]
        .reverse()
        .map(({ title, body, postTitle, color, className }, idx) => (
          <TimelineItem
            body={body || null}
            className={className || ""}
            color={color || ""}
            isLast={idx === items.length - 1}
            key={nanoid()}
            postTitle={postTitle || null}
            title={title}
          />
        ))}
    </AntdTimeline>
  );
}
