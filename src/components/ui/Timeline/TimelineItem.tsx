import { InfoCircleOutlined } from "@ant-design/icons";
import type {
  TimelineItemProps as AntdTimelineItemProps,
  TooltipProps,
} from "antd";
import { Grid, Popover, Space, Timeline, Tooltip, Typography } from "antd";
import React from "react";
import type { LiteralUnion } from "type-fest";
import type { Falsy } from "utility-types";

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
  >;
  info?:
    | Falsy
    | ((Pick<TooltipProps, "arrowPointAtCenter" | "placement"> & {
        content: React.ReactNode;
      }) &
        ({ title?: React.ReactNode; type: "popover" } | { type: "tooltip" }));
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
  const breakpoint = Grid.useBreakpoint();

  return (
    <Timeline.Item
      className={`${isLast ? "ant-timeline-item-pending" : ""} ${className}`}
      color={color || undefined}
    >
      <div>
        <Space size={breakpoint.lg ? "large" : "middle"}>
          <Typography.Text>{title}</Typography.Text>

          {(postTitle || info) && (
            <Space>
              {postTitle && (
                <small>
                  <Typography.Text italic={true} type="secondary">
                    {postTitle}
                  </Typography.Text>
                </small>
              )}

              {info &&
                (info.type === "popover" ? (
                  <Popover
                    arrowPointAtCenter={info.arrowPointAtCenter ?? true}
                    content={info.content}
                    placement={info.placement || "topLeft"}
                    title={info.title}
                  >
                    <Typography.Text type="secondary">
                      <InfoCircleOutlined />
                    </Typography.Text>
                  </Popover>
                ) : (
                  <Tooltip
                    arrowPointAtCenter={info.arrowPointAtCenter ?? true}
                    overlay={info.content}
                    placement={info.placement || "topLeft"}
                  >
                    <Typography.Text type="secondary">
                      <InfoCircleOutlined />
                    </Typography.Text>
                  </Tooltip>
                ))}
            </Space>
          )}
        </Space>
      </div>

      {body && <Typography.Text type="secondary">{body}</Typography.Text>}
    </Timeline.Item>
  );
}
