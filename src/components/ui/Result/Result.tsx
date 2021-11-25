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
}: ResultProps): JSX.Element {
  return (
    <div className={classes.Container}>
      <AntdResult status={status} subTitle={description} title={title}>
        {children}
      </AntdResult>
    </div>
  );
}

Result.defaultProps = defaultProps;
