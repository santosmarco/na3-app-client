import type { ResultProps as AntdResultProps } from "antd";
import { Result as AntdResult } from "antd";
import React, { useMemo } from "react";

import classes from "./Result.module.css";

type ResultPropsRequired = Required<
  Pick<AntdResultProps, "status" | "title">
> & {
  description: React.ReactNode;
};

type ResultProps = Omit<
  AntdResultProps,
  keyof ResultPropsRequired | "subTitle"
> &
  ResultPropsRequired & {
    children?: React.ReactNode;
    paddingBottom?: number;
    paddingTop?: number;
  };

export function Result({
  status,
  title,
  description,
  children,
  extra,
  className,
  icon,
  prefixCls,
  style: styleProp,
  paddingTop,
  paddingBottom,
}: ResultProps): JSX.Element {
  const style = useMemo(
    () => ({
      ...styleProp,
      paddingTop: paddingTop ?? styleProp?.paddingTop,
      paddingBottom: paddingBottom ?? styleProp?.paddingBottom,
    }),
    [styleProp, paddingTop, paddingBottom]
  );

  return (
    <div className={classes.Container}>
      <AntdResult
        className={className}
        extra={extra}
        icon={icon}
        prefixCls={prefixCls}
        status={status}
        style={style}
        subTitle={description}
        title={title}
      >
        {children}
      </AntdResult>
    </div>
  );
}
