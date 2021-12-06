import { Divider } from "@components";
import { ANIMATION_FADE_IN, ANIMATION_FASTER } from "@constants";
import { Card, Grid, Typography } from "antd";
import type { CSSProperties } from "react";
import React, { useCallback, useMemo } from "react";

import classes from "./DataCard.module.css";

type DataCardProps<T> = {
  bodyStyle?: CSSProperties;
  children?: React.ReactNode;
  className?: string;
  data: T;
  header?: React.ReactNode;
  onClick?: ((data: T) => void) | null;
  preTitle?: string;
  preventAnimation?: boolean;
  title: string;
};

const defaultProps = {
  bodyStyle: undefined,
  className: undefined,
  header: undefined,
  onClick: undefined,
  preTitle: undefined,
  children: undefined,
};

export function DataCard<T>({
  data,
  bodyStyle,
  className,
  onClick,
  header,
  title,
  preTitle,
  children,
  preventAnimation,
}: DataCardProps<T>): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const cardBodyStyle = useMemo(
    () => ({
      padding: 12,
      paddingLeft: breakpoint.md ? 20 : 12,
      paddingRight: breakpoint.md ? 20 : 12,
      ...bodyStyle,
    }),
    [breakpoint.md, bodyStyle]
  );

  const handleClick = useCallback(() => {
    if (onClick) onClick(data);
  }, [onClick, data]);

  return (
    <Card
      bodyStyle={cardBodyStyle}
      className={[
        classes.Card,
        preventAnimation
          ? undefined
          : `${ANIMATION_FADE_IN} ${ANIMATION_FASTER}`,
        className,
      ]
        .filter(
          (className): className is NonNullable<typeof className> => !!className
        )
        .join(" ")}
      hoverable={!!onClick}
      onClick={handleClick}
    >
      {header && <div className={classes.HeaderContainer}>{header}</div>}

      {preTitle && (
        <small className={classes.PreTitle}>
          <Typography.Text italic={true} type="secondary">
            {preTitle}
          </Typography.Text>
        </small>
      )}

      <Typography.Title className={classes.Title} level={5}>
        {title}
      </Typography.Title>

      {children && (
        <>
          <Divider marginBottom={12} marginTop={6} />
          {children}
        </>
      )}
    </Card>
  );
}

DataCard.defaultProps = defaultProps;
