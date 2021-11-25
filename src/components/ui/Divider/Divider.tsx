import type { DividerProps as AntdDividerProps } from "antd";
import { Divider as AntdDivider } from "antd";
import React from "react";

type DividerProps = AntdDividerProps & {
  children?: React.ReactNode;
  marginBottom?: number;
  marginTop?: number;
};

const defaultProps: DividerProps = {
  children: null,
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
  style,
}: DividerProps): JSX.Element {
  return (
    <AntdDivider
      className={className}
      dashed={dashed}
      orientation={orientation}
      plain={plain}
      prefixCls={prefixCls}
      style={{
        ...style,
        marginBottom: marginBottom ?? style?.marginBottom,
        marginTop: marginTop ?? style?.marginTop,
      }}
      type={type}
    >
      {children}
    </AntdDivider>
  );
}

Divider.defaultProps = defaultProps;
