import { ROUTES } from "@config";
import { NoMatchPage, NotImplementedPage } from "@pages";
import { nanoid } from "nanoid";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { PageContainer } from "./PageContainer";

export function RouteHandler(): JSX.Element {
  return (
    <Switch>
      {Object.entries(ROUTES).map(
        ([path, { component, requiredPrivileges, isPublic, notExact }]) => (
          <Route exact={!notExact} key={nanoid()} path={path}>
            <PageContainer
              isPublic={isPublic || false}
              requiredPrivileges={requiredPrivileges}
            >
              {component || <NotImplementedPage />}
            </PageContainer>
          </Route>
        )
      )}
      <Route component={NoMatchPage} path="*" />
    </Switch>
  );
}
