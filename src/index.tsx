import "animate.css";
import "./index.css";
import "dayjs/locale/pt-br";
import "web-vitals";

import { Na3Provider } from "@modules/na3-react";
import { ConfigProvider as AntdConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { initializeApp } from "firebase/app";
import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import { App } from "./App";
import {
  APP_VERSION,
  FIREBASE_CONFIG,
  FIREBASE_MESSAGING_VAPID_KEY,
  SENTRY_DSN,
} from "./config";
import { BreadcrumbProvider } from "./contexts";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import {
  handleSwRegistration,
  initFirebaseCore,
  initSentry,
  MSG_TOKENS_STORAGE_KEY,
} from "./utils";

dayjs.extend(dayOfYear);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.locale("pt-br");

const routerHistory = createBrowserHistory();

initSentry({
  appVersion: APP_VERSION,
  dsn: SENTRY_DSN,
  routerHistory,
});

const firebase = initFirebaseCore(FIREBASE_CONFIG);

function Root(): JSX.Element {
  return (
    <AntdConfigProvider input={{ autoComplete: "off" }} locale={ptBR}>
      <Na3Provider
        appVersion={APP_VERSION}
        messagingTokensStorageKey={MSG_TOKENS_STORAGE_KEY}
      >
        <Router history={routerHistory}>
          <BreadcrumbProvider>
            <App />
          </BreadcrumbProvider>
        </Router>
      </Na3Provider>
    </AntdConfigProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);

// https://cra.link/PWA
serviceWorkerRegistration.register({
  onSuccess: (swRegistration) =>
    handleSwRegistration(firebase, swRegistration, {
      firebaseMessagingVapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    }),
  onUpdate: (swRegistration) =>
    handleSwRegistration(firebase, swRegistration, {
      firebaseMessagingVapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    }),
});
