import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import { useTheme } from "../../../hooks";
import { useNa3Auth } from "../../../modules/na3-react";
import { Logo } from "../../ui/Logo/Logo";
import classes from "./Header.module.css";
import { ThemeSwitch } from "./ThemeSwitch";
import { UserInfo } from "./UserInfo";

export function Header(): JSX.Element {
  const history = useHistory();

  const auth = useNa3Auth();

  const [theme] = useTheme();

  const handleSignOut = useCallback(async () => {
    await auth.helpers.signOut();
    void message.info("Você saiu");
    history.push("/");
  }, [auth.helpers, history]);

  const handleAuthRedirect = useCallback(() => {
    history.push("/entrar");
  }, [history]);

  return (
    <div className={classes.HeaderContainer}>
      <div className={classes.Header}>
        {auth.user ? (
          <UserInfo user={auth.user} />
        ) : (
          <Link to="/">
            <Logo height={24} />
          </Link>
        )}
      </div>

      <div className={classes.Actions}>
        <ThemeSwitch />

        <Tooltip
          arrowPointAtCenter={true}
          color={auth.user ? "#ff4d4f" : undefined}
          placement="bottomRight"
          title={auth.user ? "Sair" : "Entrar"}
        >
          <Button
            className={`${classes.AuthButton} animate__animated animate__fadeIn`}
            danger={!!auth.user}
            icon={auth.user ? <LogoutOutlined /> : <LoginOutlined />}
            onClick={auth.user ? handleSignOut : handleAuthRedirect}
            shape="circle"
            type={auth.user || theme === "dark" ? "text" : "link"}
          />
        </Tooltip>
      </div>
    </div>
  );
}
