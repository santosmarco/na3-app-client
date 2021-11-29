import type { AppRoute } from "@constants";
import { useAppReady, useCurrentUser } from "@modules/na3-react";
import { AuthPage } from "@pages";
import { isArray } from "lodash";
import React, { useMemo } from "react";
import { Redirect } from "react-router-dom";

import classes from "./PageContainer.module.css";

type PageContainerProps = Required<
  Pick<AppRoute, "isPublic" | "requiredPrivileges"> & {
    children?: React.ReactNode;
  }
>;

export function PageContainer({
  requiredPrivileges,
  isPublic,
  children,
}: PageContainerProps): JSX.Element | null {
  const appIsReady = useAppReady();
  const user = useCurrentUser();

  const hasAccess = useMemo(
    () =>
      !requiredPrivileges ||
      isPublic ||
      (isArray(requiredPrivileges)
        ? user?.hasPrivileges(requiredPrivileges, { every: true })
        : requiredPrivileges(user?.privileges || [])),
    [requiredPrivileges, isPublic, user]
  );

  if (!appIsReady) {
    return null;
  }
  if (
    !hasAccess &&
    isArray(requiredPrivileges) &&
    requiredPrivileges?.includes("_super")
  ) {
    return <Redirect to="/" />;
  }
  return (
    <div className={classes.PageContainer}>
      {hasAccess ? children : <AuthPage />}
    </div>
  );
}
