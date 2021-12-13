import {
  CaptureConsole as CaptureConsoleIntegration,
  ExtraErrorData as ExtraErrorDataIntegration,
  Offline as OfflineIntegration,
} from "@sentry/integrations";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import type { History } from "history";
import type { ReadonlyDeep } from "type-fest";

type InitSentryConfig = {
  readonly appVersion: string;
  readonly dsn: string;
  readonly routerHistory: ReadonlyDeep<History<unknown>>;
};

export function initSentry({
  appVersion,
  routerHistory,
  dsn,
}: InitSentryConfig): void {
  Sentry.init({
    autoSessionTracking: true,
    debug: false,
    dsn,
    environment: process.env.NODE_ENV,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation:
          Sentry.reactRouterV5Instrumentation(routerHistory),
      }),
      new OfflineIntegration(),
      new CaptureConsoleIntegration({ levels: ["warn", "error"] }),
      new ExtraErrorDataIntegration(),
    ],
    normalizeDepth: 10,
    release: `na3-app@${appVersion}`,
    tracesSampleRate: 1.0,
  });
}
