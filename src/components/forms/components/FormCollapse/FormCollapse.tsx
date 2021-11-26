import { FormItem } from "@components";
import { Collapse } from "antd";
import React from "react";

import classes from "./FormCollapse.module.css";

export type FormCollapseProps = {
  children?: React.ReactNode;
  title: string;
};

const defaultProps: Omit<FormCollapseProps, "title"> = {
  children: null,
};

export function FormCollapse({
  title,
  children,
}: FormCollapseProps): JSX.Element {
  return (
    <FormItem>
      <Collapse ghost={true}>
        <Collapse.Panel
          className={classes.Panel}
          header={title}
          key="form-collapse"
        >
          {children}
        </Collapse.Panel>
      </Collapse>
    </FormItem>
  );
}

FormCollapse.defaultProps = defaultProps;
