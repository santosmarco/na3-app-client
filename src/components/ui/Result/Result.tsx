import type { ResultProps as AntdResultProps } from "antd";
import { Result as AntdResult } from "antd";
import React from "react";

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
  };

const defaultProps: Omit<ResultProps, keyof ResultPropsRequired> = {
  children: null,
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
  style,
}: ResultProps): JSX.Element {
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

Result.defaultProps = defaultProps;
