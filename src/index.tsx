import "animate.css";
import "./index.css";
import "dayjs/locale/pt-br";
import "web-vitals";

import { Na3Provider } from "@modules/na3-react";
import { Worker as PdfViewerWorker } from "@react-pdf-viewer/core";
import { ConfigProvider as AntdConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";

import { App } from "./App";
import {
  APP_VERSION,
  FB_MSG_TOKENS_STORAGE_KEY,
  FIREBASE_APP_CHECK_SITE_KEY,
  FIREBASE_CONFIG,
  FIREBASE_MESSAGING_VAPID_KEY,
  PDF_VIEWER_WORKER_URL,
  SENTRY_DSN,
} from "./config";
import { BreadcrumbProvider } from "./contexts";
import { Main } from "./Main";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { handleSwRegistration, initFirebaseCore, initSentry } from "./utils";

dayjs.extend(dayOfYear);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.locale("pt-br");

const routerHistory = createBrowserHistory();

if (process.env.NODE_ENV === "production") {
  initSentry({ appVersion: APP_VERSION, dsn: SENTRY_DSN, routerHistory });
}

const firebase = initFirebaseCore({
  ...FIREBASE_CONFIG,
  appCheckSiteKey: FIREBASE_APP_CHECK_SITE_KEY,
});

function Root(): JSX.Element {
  return (
    <PdfViewerWorker workerUrl={PDF_VIEWER_WORKER_URL}>
      <AntdConfigProvider input={{ autoComplete: "off" }} locale={ptBR}>
        <Na3Provider
          appVersion={APP_VERSION}
          messagingTokensStorageKey={FB_MSG_TOKENS_STORAGE_KEY}
        >
          <Router history={routerHistory}>
            <BreadcrumbProvider>
              <Main>
                <App />
              </Main>
            </BreadcrumbProvider>
          </Router>
        </Na3Provider>
      </AntdConfigProvider>
    </PdfViewerWorker>
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
  onSuccess: (swRegistration) => {
    handleSwRegistration(firebase, swRegistration, {
      firebaseMessagingVapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    });
  },
  onUpdate: (swRegistration) => {
    handleSwRegistration(firebase, swRegistration, {
      firebaseMessagingVapidKey: FIREBASE_MESSAGING_VAPID_KEY,
    });
  },
});
