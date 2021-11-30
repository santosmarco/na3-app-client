import "animate.css";
import "./index.css";
import "dayjs/locale/pt-br";
import "web-vitals";

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
import { APP_VERSION } from "./config";
import { BreadcrumbProvider } from "./contexts";
import { Na3Provider } from "./modules/na3-react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { initFirebaseCore, initFirebaseMessaging, initSentry } from "./utils";

dayjs.extend(dayOfYear);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

dayjs.locale("pt-br");

const routerHistory = createBrowserHistory();

initSentry({
  appVersion: APP_VERSION,
  dsn: "https://c384ca31afea4def96034257d183c365@o1073983.ingest.sentry.io/6073606",
  routerHistory,
});

void initFirebaseCore({
  apiKey: "AIzaSyAynKF5joA-_wpax9jzatonSZgxSE-MaRQ",
  appId: "1:810900069450:web:0f69447751bb45cac59ab3",
  authDomain: "nova-a3-ind.firebaseapp.com",
  measurementId: "G-PXKR7KDTEP",
  messagingSenderId: "810900069450",
  projectId: "nova-a3-ind",
  storageBucket: "nova-a3-ind.appspot.com",
});

function Root(): JSX.Element {
  return (
    <AntdConfigProvider input={{ autoComplete: "off" }} locale={ptBR}>
      <Na3Provider appVersion={APP_VERSION}>
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
  onSuccess: (registration) =>
    initFirebaseMessaging({
      registration,
      vapidKey:
        "BHAAggUsRBF-E-GWYHh8vY3A4r6kZMgHwrQ7qs1a6jXtU6tHxLq9WObBW-HalHDzA9YQ74U7mjiu-9nsKb0vabU",
    }),
});
