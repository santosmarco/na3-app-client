import type { EmptyProps as AntdEmptyProps } from "antd";
import { Empty as AntdEmpty } from "antd";
import React from "react";

type EmptyProps = AntdEmptyProps;

export function Empty({
  children,
  className,
  description,
  image,
  imageStyle,
  prefixCls,
  style,
}: EmptyProps): JSX.Element {
  return (
    <AntdEmpty
      className={className}
      description={description}
      image={image || AntdEmpty.PRESENTED_IMAGE_SIMPLE}
      imageStyle={imageStyle}
      prefixCls={prefixCls}
      style={style}
    >
      {children}
    </AntdEmpty>
  );
}
