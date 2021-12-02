import { Divider } from "@components";
import React from "react";

import classes from "./PopoverSectionDivider.module.css";

type PopoverSectionDividerProps = {
  marginBottom?: number;
  marginTop?: number;
};

export function PopoverSectionDivider({
  marginBottom,
  marginTop,
}: PopoverSectionDividerProps): JSX.Element {
  return (
    <div className={classes.PopoverDivider}>
      <Divider marginBottom={marginBottom ?? 12} marginTop={marginTop ?? 12} />
    </div>
  );
}
