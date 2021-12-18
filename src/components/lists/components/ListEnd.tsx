import { CheckCircleOutlined } from "@ant-design/icons";
import { Divider } from "@components";
import { getStatusColor } from "@utils";
import React, { useMemo } from "react";

import classes from "./ListEnd.module.css";

export function ListEnd(): JSX.Element {
  const iconStyle = useMemo(() => ({ color: getStatusColor("primary") }), []);

  return (
    <Divider
      icon={
        <CheckCircleOutlined className={classes.CheckIcon} style={iconStyle} />
      }
      orientation="center"
      plain={true}
    />
  );
}
