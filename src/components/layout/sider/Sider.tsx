import { MenuOutlined } from "@ant-design/icons";
import { ROUTES } from "@config";
import { SIDER_COLLAPSED_WIDTH } from "@constants";
import { useTheme } from "@hooks";
import { Grid, Layout } from "antd";
import { isArray } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { SiderLogo } from "./SiderLogo";
import { SiderMenu } from "./SiderMenu";

export type SiderItemChild = {
  path: string;
  title: string;
};

export type SiderItem = {
  children: SiderItemChild[] | undefined;
  icon: React.ReactNode;
  isPublic: boolean;
  path: string;
  section: "admin" | 1 | 2;
  title: string;
};

export function Sider(): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState<boolean>();

  const history = useHistory();
  const breakpoint = Grid.useBreakpoint();
  const [theme] = useTheme();

  const handleCollapse = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
  }, []);

  const handleMenuNavigation = useCallback(
    ({ key }: { key: string }) => {
      history.push(key);
      setIsCollapsed(true);
    },
    [history]
  );

  const handleLogoNavigation = useCallback(() => {
    handleMenuNavigation({ key: "/" });
  }, [handleMenuNavigation]);

  const siderItems = useMemo(
    (): (SiderItem | null)[] =>
      Object.entries(ROUTES).map(
        ([
          path,
          { siderConfig, title, icon, requiredPrivileges, isPublic },
        ]) => {
          const itemTitle = title || siderConfig?.title;

          if (!siderConfig || !itemTitle) return null;
          else
            return {
              children: siderConfig.children,
              icon,
              path,
              title: itemTitle,
              section:
                isArray(requiredPrivileges) &&
                requiredPrivileges?.includes("_super")
                  ? "admin"
                  : siderConfig.section || 1,
              isPublic: isPublic || false,
            };
        }
      ),
    []
  );

  const zeroWidthTriggerStyle = useMemo(
    () => ({
      alignItems: "center",
      background: "transparent",
      color: theme === "light" ? "#111" : "#fff",
      display: "flex",
      height: 48,
      justifyContent: "center",
      right: -46,
      top: 0,
      width: 46,
    }),
    [theme]
  );

  useEffect(() => {
    if (isCollapsed === undefined && "md" in breakpoint) {
      setIsCollapsed(!breakpoint.md);
    }
  }, [breakpoint, isCollapsed]);

  return (
    <Layout.Sider
      collapsed={!!isCollapsed}
      collapsedWidth={
        breakpoint.md || !isCollapsed
          ? SIDER_COLLAPSED_WIDTH.MD
          : SIDER_COLLAPSED_WIDTH.XS
      }
      collapsible={true}
      onCollapse={handleCollapse}
      trigger={!breakpoint.md && isCollapsed && <MenuOutlined />}
      width={
        breakpoint.xxl
          ? 330
          : breakpoint.lg
          ? 275
          : breakpoint.md
          ? 220
          : "100%"
      }
      zeroWidthTriggerStyle={zeroWidthTriggerStyle}
    >
      <SiderLogo isCollapsed={!!isCollapsed} onClick={handleLogoNavigation} />
      <SiderMenu
        items={siderItems.filter((item): item is SiderItem => !!item)}
        onNavigation={handleMenuNavigation}
      />
    </Layout.Sider>
  );
}
