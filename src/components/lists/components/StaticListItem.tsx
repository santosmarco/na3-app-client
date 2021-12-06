import { ANIMATION_FADE_IN, ANIMATION_FASTER } from "@constants";
import { Avatar, Card } from "antd";
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import classes from "./StaticListItem.module.css";

export type StaticListItemProps = {
  cardClassName?: string;
  colors: { background: string; foreground: string };
  description: React.ReactNode;
  href?: string;
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  preventAnimation?: boolean;
  title: React.ReactNode;
};

export function StaticListItem({
  title,
  description,
  icon,
  colors,
  href,
  onClick,
  cardClassName,
  preventAnimation,
}: StaticListItemProps): JSX.Element {
  const history = useHistory();

  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      if (onClick) onClick(ev);
      else if (href) history.push(href);
    },
    [history, onClick, href]
  );

  const coloredAvatarStyle = useMemo(
    () => ({ backgroundColor: colors.background, color: colors.foreground }),
    [colors]
  );

  return (
    <Card
      className={[
        classes.Card,
        preventAnimation
          ? undefined
          : `${ANIMATION_FADE_IN} ${ANIMATION_FASTER}`,
        cardClassName,
      ]
        .filter(
          (className): className is NonNullable<typeof className> => !!className
        )
        .join(" ")}
      hoverable={!!(onClick || href)}
      onClick={handleClick}
      size="small"
    >
      <Card.Meta
        avatar={
          <Avatar
            className={classes.Avatar}
            icon={icon}
            style={coloredAvatarStyle}
          />
        }
        description={description}
        title={title}
      />
    </Card>
  );
}
