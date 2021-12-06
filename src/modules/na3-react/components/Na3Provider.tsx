import React from "react";
import { Provider as StoreProvider } from "react-redux";

import { store } from "../store";
import type { ConfigState } from "../types";
import { Na3AuthController } from "./controllers/auth/AuthController";
import { Na3MainController } from "./controllers/MainController";
import { Na3MaintenanceProjectsController } from "./controllers/MaintProjectsController";
import { Na3PeopleController } from "./controllers/na3/Na3PeopleController";
import { Na3ProductsController } from "./controllers/na3/Na3ProductsController";
import { Na3ServiceOrdersController } from "./controllers/ServiceOrdersController";
import { Na3StdDocsController } from "./controllers/StdDocs";
import { Na3TransfLabelTemplatesController } from "./controllers/TransfLabelTemplatesController";
import { Na3UsersController } from "./controllers/UsersController";

type Na3ProviderProps = {
  appVersion: string;
  children?: React.ReactNode;
  env?: ConfigState["environment"];
  messagingTokensStorageKey?: string;
};

const defaultProps: Omit<Na3ProviderProps, "appVersion"> = {
  children: null,
  env: undefined,
  messagingTokensStorageKey: undefined,
};

export function Na3Provider({
  appVersion,
  env,
  messagingTokensStorageKey,
  children,
}: Na3ProviderProps): JSX.Element {
  return (
    <StoreProvider store={store}>
      {/* Main */}
      <Na3MainController
        appVersion={appVersion}
        env={env || process.env.NODE_ENV}
        messagingTokensStorageKey={messagingTokensStorageKey}
      />

      {/* Auth & Users */}
      <Na3AuthController />
      <Na3UsersController />

      {/* Na3 */}
      <Na3ProductsController />
      <Na3PeopleController />

      <Na3TransfLabelTemplatesController />
      <Na3ServiceOrdersController />
      <Na3MaintenanceProjectsController />
      <Na3StdDocsController />

      {/* App */}
      {children}
    </StoreProvider>
  );
}

Na3Provider.defaultProps = defaultProps;
