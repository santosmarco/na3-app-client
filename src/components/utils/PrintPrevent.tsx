import { Divider, Logo } from "@components";
import { Typography } from "antd";
import React from "react";

import classes from "./PrintPrevent.module.css";

type PrintPreventProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export function PrintPrevent({
  children,
  disabled,
}: PrintPreventProps): JSX.Element {
  return (
    <>
      <div
        className={`${classes.PrintPrevent} ${
          disabled ? classes.PrintPreventDisabled : classes.PrintPreventEnabled
        }`}
      >
        <div className={classes.PrintPreventContent}>
          <Logo
            className={classes.PrintPreventLogo}
            height={48}
            theme="light"
          />

          <Typography.Title className={classes.PrintPreventTitle} level={4}>
            Você não pode imprimir esta página.
          </Typography.Title>

          <Divider color="#111" />

          <Typography.Text className={classes.PrintPreventHelp} italic={true}>
            Se você acha que isso foi um engano, por favor, entre em contato com
            o administrador do sistema.
          </Typography.Text>
        </div>
      </div>

      {children}
    </>
  );
}
