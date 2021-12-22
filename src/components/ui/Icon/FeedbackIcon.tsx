import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ExclamationCircleTwoTone,
  InfoCircleTwoTone,
} from "@ant-design/icons";
import { Icon, Text } from "@components";
import type { AntdStatus } from "@utils";
import { getStatusColor } from "@utils";
import React, { useMemo } from "react";

import type { IconSize, IconSpace } from "./Icon";

type FeedbackIconProps = {
  children?: React.ReactNode;
  icon?:
    | React.ReactNode
    | {
        render: (props: {
          color: string;
          status: AntdStatus;
        }) => React.ReactNode;
      };
  size?: IconSize;
  space?: IconSpace;
  type: "default" | "fail" | "success" | "warning";
};

export function FeedbackIcon({
  children,
  type,
  size,
  space,
  icon: iconProp,
}: FeedbackIconProps): JSX.Element {
  const iconStatus = useMemo((): AntdStatus => {
    switch (type) {
      case "fail":
        return "error";
      case "success":
      case "warning":
        return type;

      default:
        return "primary";
    }
  }, [type]);

  const iconColor = useMemo(() => getStatusColor(iconStatus), [iconStatus]);

  const iconComponent = useMemo((): React.ReactNode => {
    if (
      typeof iconProp === "object" &&
      iconProp !== null &&
      "render" in iconProp
    ) {
      return iconProp.render({ color: iconColor, status: iconStatus });
    } else if (iconProp) {
      return iconProp;
    }

    let icon: React.ReactNode;
    switch (iconStatus) {
      case "error":
        icon = <CloseCircleTwoTone twoToneColor={iconColor} />;
        break;
      case "success":
        icon = <CheckCircleTwoTone twoToneColor={iconColor} />;
        break;
      case "warning":
        icon = <ExclamationCircleTwoTone twoToneColor={iconColor} />;
        break;

      default:
        icon = <InfoCircleTwoTone twoToneColor={iconColor} />;
    }

    return icon;
  }, [iconStatus, iconColor, iconProp]);

  const labelComponent = useMemo(
    () =>
      children && (
        <Text
          type={
            iconStatus === "error"
              ? "danger"
              : iconStatus === "primary"
              ? undefined
              : iconStatus
          }
        >
          {children}
        </Text>
      ),
    [iconStatus, children]
  );

  return (
    <Icon label={labelComponent} size={size} space={space}>
      {iconComponent}
    </Icon>
  );
}
