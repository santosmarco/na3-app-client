import { blue } from "@ant-design/colors";
import { CheckCircleOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";

import { Divider } from "../../ui/Divider/Divider";
import classes from "./ListEnd.module.css";

export function ListEnd(): JSX.Element {
  const iconStyle = useMemo(() => ({ color: blue.primary }), []);

  return (
    <Divider plain={true}>
      <CheckCircleOutlined
        className={classes.CheckIcon}
        color={blue.primary}
        style={iconStyle}
      />
    </Divider>
  );
}
