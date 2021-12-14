import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Logo } from "@components";
import { ANIMATION_FADE_IN } from "@constants";
import { useTheme } from "@hooks";
import { useNa3Auth } from "@modules/na3-react";
import { Button, message, Tooltip } from "antd";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

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
      <div>
        {auth.currentUser ? (
          <UserInfo user={auth.currentUser} />
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
          color={auth.currentUser ? "#ff4d4f" : undefined}
          placement="bottomRight"
          title={auth.currentUser ? "Sair" : "Entrar"}
        >
          <Button
            className={`${classes.AuthButton} ${ANIMATION_FADE_IN}`}
            danger={!!auth.currentUser}
            icon={auth.currentUser ? <LogoutOutlined /> : <LoginOutlined />}
            onClick={auth.currentUser ? handleSignOut : handleAuthRedirect}
            shape="circle"
            type={auth.currentUser || theme === "dark" ? "text" : "link"}
          />
        </Tooltip>
      </div>
    </div>
  );
}
