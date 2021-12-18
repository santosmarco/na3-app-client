import { useId } from "@hooks";
import { handleFilterFalsies } from "@utils";
import { Collapse as AntdCollapse, Typography } from "antd";
import { nanoid } from "nanoid";
import React from "react";
import type { Falsy } from "utility-types";

import classes from "./Collapse.module.css";

export type CollapseProps = {
  panels: Array<
    | Falsy
    | {
        header: React.ReactNode;
        content: React.ReactNode;
        icon?: React.ReactNode;
        withMarginLeft?: boolean;
        withMarginRight?: boolean;
      }
  >;
  ghost?: boolean;
  defaultOpen?: boolean;
  expandIconPosition?: "left" | "right";
};

const defaultProps = {
  ghost: true,
};

export function Collapse({
  panels,
  ghost,
  defaultOpen,
  expandIconPosition,
}: CollapseProps): JSX.Element {
  const headPanelKey = useId();

  return (
    <AntdCollapse
      defaultActiveKey={defaultOpen ? [headPanelKey] : undefined}
      expandIconPosition={expandIconPosition}
      ghost={ghost}
    >
      {panels
        .filter(handleFilterFalsies)
        .map(
          ({ header, content, icon, withMarginLeft, withMarginRight }, idx) => (
            <AntdCollapse.Panel
              header={
                <>
                  {icon && (
                    <Typography.Text
                      className={classes.PanelHeaderIcon}
                      type="secondary"
                    >
                      {icon}
                    </Typography.Text>
                  )}
                  {header}
                </>
              }
              key={idx === 0 ? headPanelKey : nanoid()}
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

Collapse.defaultProps = defaultProps;
