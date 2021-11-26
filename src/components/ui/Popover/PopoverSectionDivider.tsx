import { Divider } from "@components";
import React from "react";

import classes from "./PopoverSectionDivider.module.css";

export function PopoverSectionDivider(): JSX.Element {
  return (
    <div className={classes.PopoverDivider}>
      <Divider marginBottom={12} marginTop={12} />
    </div>
  );
}
