import { Collapse as AntdCollapse, Typography } from "antd";
import { nanoid } from "nanoid";
import React from "react";

import classes from "./Collapse.module.css";

export type CollapseProps = {
  panels: {
    header: React.ReactNode;
    content: React.ReactNode;
    headerIcon?: React.ReactNode;
    withMarginLeft?: boolean;
    withMarginRight?: boolean;
  }[];
  ghost?: boolean;
};

export function Collapse({ panels, ghost }: CollapseProps): JSX.Element {
  return (
    <AntdCollapse ghost={ghost === false ? false : true}>
      {panels.map(
        ({ header, content, headerIcon, withMarginLeft, withMarginRight }) => (
          <AntdCollapse.Panel
            key={nanoid()}
            header={
              <>
                {headerIcon && (
                  <Typography.Text
                    type="secondary"
                    className={classes.PanelHeaderIcon}
                  >
                    {headerIcon}
                  </Typography.Text>
                )}
                {header}
              </>
            }
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
