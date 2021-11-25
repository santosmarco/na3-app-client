import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge, Grid, Popover, Tooltip, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { AppUser } from "../../../modules/na3-react";
import { useNa3ServiceOrders } from "../../../modules/na3-react";
import classes from "./UserInfo.module.css";
import { UserMessages } from "./UserMessages";

type UserInfoProps = {
  user: AppUser;
};

export function UserInfo({ user }: UserInfoProps): JSX.Element | null {
  const [tooltipIsVisible, setTooltipIsVisible] = useState(false);
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);

  const breakpoint = Grid.useBreakpoint();

  const serviceOrders = useNa3ServiceOrders();

  const urgentServiceOrders = useMemo(
    () => serviceOrders.helpers.getWithActionRequired(),
    [serviceOrders.helpers]
  );

  const messageCount = useMemo(
    () => urgentServiceOrders.length,
    [urgentServiceOrders.length]
  );

  const handleTooltipVisibilityChange = useCallback(
    (visible: boolean) => {
      if (!breakpoint.lg) return;
      setPopoverIsVisible(false);
      setTooltipIsVisible(visible);
    },
    [breakpoint.lg]
  );

  const handlePopoverVisibilityChange = useCallback((visible: boolean) => {
    setTooltipIsVisible(false);
    setPopoverIsVisible(visible);
  }, []);

  const handleActionButtonClick = useCallback(() => {
    setPopoverIsVisible(false);
    setTooltipIsVisible(false);
  }, []);

  useEffect(() => {
    if (messageCount > 0) {
      setTooltipIsVisible(true);
    }
  }, [messageCount]);

  if (!user) {
    return null;
  }
  return (
    <Tooltip
      onVisibleChange={handleTooltipVisibilityChange}
      placement="bottomLeft"
      title={
        messageCount > 1
          ? `${messageCount} novas mensagens`
          : `${messageCount === 0 ? "Nenhuma" : "Uma"} nova mensagem`
      }
      visible={tooltipIsVisible}
    >
      <Popover
        className={`${classes.UserInfo} animate__animated animate__fadeIn`}
        content={
          <UserMessages
            onActionBtnClick={handleActionButtonClick}
            serviceOrders={urgentServiceOrders}
          />
        }
        onVisibleChange={handlePopoverVisibilityChange}
        placement="bottomLeft"
        title="Suas mensagens"
        trigger="click"
        visible={popoverIsVisible}
      >
        <Badge count={messageCount} size="small">
          <Avatar icon={<UserOutlined />} size="small" style={user.style} />
        </Badge>

        <small>
          <Typography.Title className={classes.Username} level={5}>
            {user.displayName.toUpperCase()}
          </Typography.Title>
        </small>
      </Popover>
    </Tooltip>
  );
}
