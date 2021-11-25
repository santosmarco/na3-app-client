import { blue } from "@ant-design/colors";
import { CheckCircleOutlined } from "@ant-design/icons";
import React from "react";

import { Divider } from "../../ui/Divider/Divider";
import classes from "./ListEnd.module.css";

export function ListEnd(): JSX.Element {
  return (
    <Divider plain={true}>
      <CheckCircleOutlined
        className={classes.CheckIcon}
        style={{ color: blue.primary }}
      />
    </Divider>
  );
}
