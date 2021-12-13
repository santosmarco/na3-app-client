import type { AppRoute } from "@config";
import { PAGE_CONTAINER_PADDING } from "@constants";
import { useAppReady, useCurrentUser } from "@modules/na3-react";
import { AuthPage } from "@pages";
import { Grid } from "antd";
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
  const breakpoint = Grid.useBreakpoint();

  const appIsReady = useAppReady();
  const user = useCurrentUser();

  const hasAccess = useMemo(() => {
    if (!requiredPrivileges || isPublic || user?.isSuper) return true;

    if (isArray(requiredPrivileges)) {
      return user?.hasPrivileges(requiredPrivileges, { every: true });
    } else if ("privileges" in requiredPrivileges) {
      return user?.hasPrivileges(
        requiredPrivileges.privileges,
        requiredPrivileges
      );
    } else {
      return requiredPrivileges(user?.privileges || []);
    }
  }, [requiredPrivileges, isPublic, user]);

  const style = useMemo(() => {
    const paddingX = breakpoint.md
      ? PAGE_CONTAINER_PADDING.X.MD
      : PAGE_CONTAINER_PADDING.X.XS;

    return {
      paddingTop: breakpoint.md
        ? PAGE_CONTAINER_PADDING.TOP.MD
        : PAGE_CONTAINER_PADDING.TOP.XS,
      paddingBottom: PAGE_CONTAINER_PADDING.BOTTOM,
      paddingLeft: paddingX,
      paddingRight: paddingX,
    };
  }, [breakpoint.md]);

  if (!appIsReady) {
    return null;
  }
  if (
    !hasAccess &&
    isArray(requiredPrivileges) &&
    requiredPrivileges.includes("_super")
  ) {
    return <Redirect to="/" />;
  }
  return (
    <div className={classes.PageContainer} style={style}>
      {hasAccess ? children : <AuthPage />}
    </div>
  );
}
