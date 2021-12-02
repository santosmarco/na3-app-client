import {
  ChangePwdModal,
  Content,
  Footer,
  Header,
  Helmet,
  RouteHandler,
  Sider,
  Spinner,
  ThemeLoadHandler,
} from "@components";
import { useAppReady } from "@modules/na3-react";
import { Layout, message, notification } from "antd";
import firebase from "firebase";
import React, { useEffect, useRef } from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import Div100vh from "react-div-100vh";
import useLocalStorage from "react-use-localstorage";

import classes from "./App.module.css";

const themes = {
  dark: `${process.env.PUBLIC_URL}/themes/dark.theme.css`,
  light: `${process.env.PUBLIC_URL}/themes/light.theme.css`,
};

notification.config({ duration: 6 });

function Main(): JSX.Element {
  const appIsReady = useAppReady();

  const connectionStatus = useRef<"offline" | "online">("online");

  // Handle internet connectivity changes
  useEffect(() => {
    function handleIsOffline(): void {
      if (connectionStatus.current === "online") {
        // Start onOffline routine
        void (async (): Promise<void> => {
          // Queue all Firestore's write operations and make all snapshot
          // listeners and document requests retrieve results from the cache
          // until user is back online.
          await firebase.firestore().disableNetwork();
          // Display a persistent "You are offline" message.
          void message.warn({
            content: "Você está offline",
            // Persist the message until user is back online.
            duration: 0,
            // Give the message a unique key so that it can be destroyed when
            // user is back online.
            key: "offlineMsg",
          });

          connectionStatus.current = "offline";
        })();
      }
    }
    function handleIsOnline(): void {
      if (connectionStatus.current === "offline") {
        // Start onOnline routine
        void (async (): Promise<void> => {
          // Re-enable Firestore's network access.
          await firebase.firestore().enableNetwork();
          // Wait for pending Firestore's writes.
          await firebase.firestore().waitForPendingWrites();
          // Display a "You are online" message.
          void message.success("Você está online");
          // Destroy the "You are offline" message.
          message.destroy("offlineMsg");

          connectionStatus.current = "online";
        })();
      }
    }

    window.addEventListener("offline", handleIsOffline);
    window.addEventListener("online", handleIsOnline);

    return (): void => {
      window.removeEventListener("offline", handleIsOffline);
      window.removeEventListener("online", handleIsOnline);
    };
  }, []);

  return (
    <>
      <Helmet />

      <Spinner spinning={!appIsReady}>
        <Div100vh>
          <Layout className={classes.App}>
            <Sider />
            <Layout>
              <Header />
              <Content>
                <RouteHandler />
              </Content>
              <Footer />
            </Layout>
          </Layout>
        </Div100vh>

        <ChangePwdModal />
      </Spinner>
    </>
  );
}

export function App(): JSX.Element {
  const [storedTheme] = useLocalStorage("NA3_APP_PREFERRED_THEME", "light");

  return (
    <ThemeSwitcherProvider
      defaultTheme={storedTheme}
      insertionPoint={document.getElementById("themes-insertion-point")}
      themeMap={themes}
    >
      <Main />
      <ThemeLoadHandler />
    </ThemeSwitcherProvider>
  );
}
