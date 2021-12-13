import { Collapse as AntdCollapse } from "antd";
import { nanoid } from "nanoid";
import React from "react";

export type CollapseProps = {
  panels: {
    header: React.ReactNode;
    content: React.ReactNode;
    withMarginLeft?: boolean;
    withMarginRight?: boolean;
  }[];
  ghost?: boolean;
};

export function Collapse({ panels, ghost }: CollapseProps): JSX.Element {
  return (
    <AntdCollapse ghost={ghost === false ? false : true}>
      {panels.map(({ header, content, withMarginLeft, withMarginRight }) => (
        <AntdCollapse.Panel
          key={nanoid()}
          header={header}
          style={{
            marginLeft: withMarginLeft ? undefined : -16,
            marginRight: withMarginRight ? undefined : -16,
          }}
        >
          {content}
        </AntdCollapse.Panel>
      ))}
    </AntdCollapse>
  );
}
