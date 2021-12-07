import type { DividerProps as AntdDividerProps } from "antd";
import { Divider as AntdDivider, Typography } from "antd";
import React, { useMemo } from "react";

import classes from "./Divider.module.css";

type DividerProps = AntdDividerProps & {
  children?: React.ReactNode;
  color?: string;
  icon?: React.ReactNode;
  marginBottom?: number;
  marginTop?: number;
  marginY?: number;
  pre?: React.ReactNode;
};

const defaultProps: DividerProps = {
  children: undefined,
  marginBottom: undefined,
  marginTop: undefined,
};

export function Divider({
  children,
  className,
  dashed,
  marginBottom,
  marginTop,
  orientation,
  plain,
  prefixCls,
  type,
  style: styleProp,
  icon,
  pre,
  marginY,
  color,
}: DividerProps): JSX.Element {
  const style = useMemo(
    () => ({
      ...styleProp,
      marginBottom: marginBottom ?? marginY ?? styleProp?.marginBottom,
      marginTop: marginTop ?? marginY ?? styleProp?.marginTop,
      backgroundColor: color ?? styleProp?.color,
    }),
    [styleProp, marginBottom, marginTop, marginY, color]
  );

  return (
    <div>
      <AntdDivider
        className={className}
        dashed={dashed}
        orientation={orientation || "left"}
        plain={plain}
        prefixCls={prefixCls}
        style={style}
        type={type}
      >
        {(icon || pre || children) && (
          <>
            {icon && <span className={classes.Icon}>{icon}</span>}

            {pre && (
              <small className={classes.Pre}>
                <Typography.Text italic={true} type="secondary">
                  {pre}
                </Typography.Text>
              </small>
            )}

            {children}
          </>
        )}
      </AntdDivider>
    </div>
  );
}

Divider.defaultProps = defaultProps;
