import { Collapse, FormItem } from "@components";
import { Grid } from "antd";
import React, { useMemo } from "react";

export type FormCollapseProps = {
  children?: React.ReactNode;
  title: string;
};

export function FormCollapse({
  title,
  children,
}: FormCollapseProps): JSX.Element {
  const breakpoint = Grid.useBreakpoint();

  const collapsePanel = useMemo(
    () => ({ header: title, content: children, withMarginLeft: breakpoint.md }),
    [title, children, breakpoint.md]
  );

  return (
    <FormItem>
      <Collapse panels={[collapsePanel]} />
    </FormItem>
  );
}
