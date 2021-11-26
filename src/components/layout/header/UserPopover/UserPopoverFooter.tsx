import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router";

import classes from "./UserPopoverFooter.module.css";

type UserPopoverFooterProps = {
  isPrimary: boolean;
  onNavigation: () => void;
};

export function UserPopoverFooter({
  onNavigation,
  isPrimary,
}: UserPopoverFooterProps): JSX.Element {
  const history = useHistory();

  const handleAccountNavigation = useCallback(() => {
    history.push("/conta");
    onNavigation();
  }, [history, onNavigation]);

  const handleHomeNavigation = useCallback(() => {
    history.push("/");
    onNavigation();
  }, [history, onNavigation]);

  return (
    <div className={classes.Footer}>
      <div className={classes.AccountBtnContainer}>
        <Button
          block={true}
          icon={<UserOutlined />}
          onClick={handleAccountNavigation}
          size="small"
          type={isPrimary ? "primary" : "default"}
        >
          Minha Conta
        </Button>
      </div>

      <Button
        className={classes.HomeBtn}
        icon={<HomeOutlined />}
        onClick={handleHomeNavigation}
        size="small"
        type={isPrimary ? "default" : "dashed"}
      />
    </div>
  );
}
