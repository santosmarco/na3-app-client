import type { InfoProps } from "@components";
import { Info } from "@components";
import type { TimelineItemProps as AntdTimelineItemProps } from "antd";
import { Timeline, Typography } from "antd";
import React from "react";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

import classes from "./TimelineItem.module.css";

export type TimelineItemProps = Partial<
  Pick<AntdTimelineItemProps, "className">
> & {
  body?: React.ReactNode;
  color?: LiteralUnion<
    | "cyan"
    | "gold"
    | "green"
    | "lime"
    | "magenta"
    | "orange"
    | "purple"
    | "red"
    | "volcano",
    string
  > | null;
  info?: Falsy | Omit<InfoProps, "children">;
  postTitle?: React.ReactNode;
  title: React.ReactNode;
};

type TimelineItemPrivateProps = Required<TimelineItemProps> & {
  isLast: boolean;
};

export function TimelineItem({
  className,
  color,
  body,
  postTitle,
  title,
  isLast,
  info,
}: TimelineItemPrivateProps): JSX.Element {
  return (
    <Timeline.Item
      className={`${isLast ? "ant-timeline-item-pending" : ""} ${className}`}
      color={color || undefined}
    >
      <div>
        <Typography.Text>{title}</Typography.Text>

        {(postTitle || info) && (
          <>
            {postTitle && (
              <small className={classes.Right}>
                <Typography.Text italic={true} type="secondary">
                  {postTitle}
                </Typography.Text>
              </small>
            )}

            {info && (
              <Info
                arrowPointAtCenter={info.arrowPointAtCenter}
                gapLeft={info.gapLeft || "small"}
                icon={info.icon}
                placement={info.placement}
                title={info.title}
                variant={info.variant}
              >
                {info.content}
              </Info>
            )}
          </>
        )}
      </div>

      {body && <Typography.Text type="secondary">{body}</Typography.Text>}
    </Timeline.Item>
  );
}
