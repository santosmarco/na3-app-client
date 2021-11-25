import React, { useMemo } from "react";

import { useAppReady, useNa3User } from "../../modules/na3-react";
import type { Na3UserPrivilegeId } from "../../modules/na3-types";
import { AuthPage } from "../../pages";
import classes from "./PageContainer.module.css";

type PageContainerProps = {
  children?: React.ReactNode;
  requiredPrivileges: Na3UserPrivilegeId[] | null;
};

const defaultProps = {
  children: null,
};

export function PageContainer({
  requiredPrivileges,
  children,
}: PageContainerProps): JSX.Element | null {
  const appIsReady = useAppReady();
  const user = useNa3User();

  const hasAccess = useMemo(
    () =>
      !requiredPrivileges ||
      user?.hasPrivileges(requiredPrivileges, { all: true }),
    [requiredPrivileges, user]
  );

  if (!appIsReady) {
    return null;
  }
  return (
    <div className={classes.PageContainer}>
      {hasAccess ? children : <AuthPage />}
    </div>
  );
}

PageContainer.defaultProps = defaultProps;
