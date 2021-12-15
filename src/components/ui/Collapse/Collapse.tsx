import { Collapse as AntdCollapse, Typography } from "antd";
import { nanoid } from "nanoid";
import React from "react";

import classes from "./Collapse.module.css";

export type CollapseProps = {
  panels: Array<{
    header: React.ReactNode;
    content: React.ReactNode;
    headerIcon?: React.ReactNode;
    withMarginLeft?: boolean;
    withMarginRight?: boolean;
  }>;
  ghost?: boolean;
  defaultOpen?: boolean;
};

export function Collapse({
  panels,
  ghost,
  defaultOpen,
}: CollapseProps): JSX.Element {
  return (
    <AntdCollapse
      defaultActiveKey={defaultOpen ? "headPanel" : undefined}
      ghost={ghost === false ? false : true}
    >
      {panels.map(
        (
          { header, content, headerIcon, withMarginLeft, withMarginRight },
          idx
        ) => (
          <AntdCollapse.Panel
            header={
              <>
                {headerIcon && (
                  <Typography.Text
                    className={classes.PanelHeaderIcon}
                    type="secondary"
                  >
                    {headerIcon}
                  </Typography.Text>
                )}
                {header}
              </>
            }
            key={idx === 0 ? "headPanel" : nanoid()}
            style={{
              marginLeft: withMarginLeft ? undefined : -16,
              marginRight: withMarginRight ? undefined : -16,
            }}
          >
            {content}
          </AntdCollapse.Panel>
        )
      )}
    </AntdCollapse>
  );
}
