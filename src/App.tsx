import {
  ChangePwdModal,
  Content,
  Footer,
  Header,
  Helmet,
  RouteHandler,
  Sider,
  Spinner,
} from "@components";
import { useAppReady } from "@modules/na3-react";
import { Layout, message } from "antd";
import {
  disableNetwork,
  enableNetwork,
  getFirestore,
  waitForPendingWrites,
} from "firebase/firestore";
import React, { useEffect, useRef } from "react";
import Div100vh from "react-div-100vh";

import classes from "./App.module.css";

export function App(): JSX.Element {
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
          await disableNetwork(getFirestore());
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
          await enableNetwork(getFirestore());
          // Wait for pending Firestore's writes.
          await waitForPendingWrites(getFirestore());
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
