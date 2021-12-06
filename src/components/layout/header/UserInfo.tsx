import { UserAvatar, UserDisplayName } from "@components";
import { ANIMATION_FADE_IN, ANIMATION_FADE_OUT } from "@constants";
import type { AppUser } from "@modules/na3-react";
import { useNa3ServiceOrders } from "@modules/na3-react";
import { Badge, Grid, Popover, Tooltip } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import classes from "./UserInfo.module.css";
import { UserPopover } from "./UserPopover/UserPopover";

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

  const handleCloseAll = useCallback(() => {
    setPopoverIsVisible(false);
    setTooltipIsVisible(false);
  }, []);

  useEffect(() => {
    if (messageCount > 0) {
      setTooltipIsVisible(true);
    }
  }, [messageCount]);

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
        content={
          <UserPopover
            hasMessages={messageCount > 0}
            onClose={handleCloseAll}
            urgentServiceOrders={urgentServiceOrders}
          />
        }
        onVisibleChange={handlePopoverVisibilityChange}
        placement="bottomLeft"
        title="Suas mensagens"
        trigger="click"
        visible={popoverIsVisible}
      >
        <div
          className={`${classes.UserInfo} ${
            user ? ANIMATION_FADE_IN : ANIMATION_FADE_OUT
          }`}
        >
          <Badge count={messageCount} size="small">
            <UserAvatar size="small" type="icon" user={user} />
          </Badge>

          <UserDisplayName
            className={classes.UserDisplayName}
            level={5}
            type="compact"
            user={user}
          />
        </div>
      </Popover>
    </Tooltip>
  );
}
