import { blue } from "@ant-design/colors";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Divider } from "@components";
import React, { useMemo } from "react";

import classes from "./ListEnd.module.css";

export function ListEnd(): JSX.Element {
  const iconStyle = useMemo(() => ({ color: blue.primary }), []);

  return (
    <Divider
      icon={
        <CheckCircleOutlined
          className={classes.CheckIcon}
          color={blue.primary}
          style={iconStyle}
        />
      }
      orientation="center"
      plain={true}
    />
  );
}
