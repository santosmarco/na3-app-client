import { FormItem } from "@components";
import { Collapse } from "antd";
import { nanoid } from "nanoid";
import React from "react";

import classes from "./FormCollapse.module.css";

export type FormCollapseProps = {
  children?: React.ReactNode;
  title: string;
};

export function FormCollapse({
  title,
  children,
}: FormCollapseProps): JSX.Element {
  return (
    <FormItem>
      <Collapse ghost={true}>
        <Collapse.Panel className={classes.Panel} header={title} key={nanoid()}>
          {children}
        </Collapse.Panel>
      </Collapse>
    </FormItem>
  );
}
