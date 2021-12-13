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
};

export function Collapse({ panels, ghost }: CollapseProps): JSX.Element {
  return (
    <AntdCollapse ghost={ghost === false ? false : true}>
      {panels.map(
        ({ header, content, headerIcon, withMarginLeft, withMarginRight }) => (
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
            key={nanoid()}
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
