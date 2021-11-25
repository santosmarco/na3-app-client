import { LoadingOutlined } from "@ant-design/icons";
import type { SpinProps } from "antd";
import { Spin } from "antd";
import React from "react";

import classes from "./Spinner.module.css";

type SpinnerProps = Omit<SpinProps, "tip"> & {
  children?: React.ReactNode;
  color?: string;
  text?: string | null;
};

const defaultProps: SpinnerProps = {
  children: null,
  color: undefined,
  text: undefined,
};

export function Spinner({
  children,
  className,
  delay,
  indicator,
  prefixCls,
  size,
  spinning,
  style,
  text,
  wrapperClassName,
  color,
}: SpinnerProps): JSX.Element {
  return (
    <Spin
      className={className || classes.Spin}
      delay={delay}
      indicator={
        indicator || (
          <LoadingOutlined
            className={classes.Indicator}
            color={color}
            spin={true}
          />
        )
      }
      prefixCls={prefixCls}
      size={size}
      spinning={spinning}
      style={style}
      tip={text === null ? undefined : text || "Carregando..."}
      wrapperClassName={wrapperClassName || classes.Spin}
    >
      {children}
    </Spin>
  );
}

Spinner.defaultProps = defaultProps;
