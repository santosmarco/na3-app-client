import type { DividerProps as AntdDividerProps } from "antd";
import { Divider as AntdDivider } from "antd";
import React, { useMemo } from "react";

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
  style: styleProp,
}: DividerProps): JSX.Element {
  const style = useMemo(
    () => ({
      ...styleProp,
      marginBottom: marginBottom ?? styleProp?.marginBottom,
      marginTop: marginTop ?? styleProp?.marginTop,
    }),
    [styleProp, marginBottom, marginTop]
  );

  return (
    <AntdDivider
      className={className}
      dashed={dashed}
      orientation={orientation}
      plain={plain}
      prefixCls={prefixCls}
      style={style}
      type={type}
    >
      {children}
    </AntdDivider>
  );
}

Divider.defaultProps = defaultProps;
