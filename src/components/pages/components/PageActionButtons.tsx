import type { RowProps } from "antd";
import { Row, Space } from "antd";
import React from "react";

import classes from "./PageActionButtons.module.css";

type PageActionButtonsProps = Partial<Pick<RowProps, "align" | "justify">> &
  (
    | { children?: React.ReactNode; left?: undefined; right?: undefined }
    | { children?: undefined; left: React.ReactNode; right: React.ReactNode }
  );

export function PageActionButtons({
  children,
  align,
  justify,
  left,
  right,
}: PageActionButtonsProps): JSX.Element {
  return (
    <Row
      align={align || "middle"}
      className={classes.Container}
      justify={justify || (left && right && "space-between") || "end"}
    >
      {left && right && (
        <>
          <div>
            <Space>{left}</Space>
          </div>
          <div>
            <Space>{right}</Space>
          </div>
        </>
      )}

      {children && <Space>{children}</Space>}
    </Row>
  );
}
