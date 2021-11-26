import { Menu } from "antd";
import React, { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useCurrentUser } from "../../../modules/na3-react";
import type { SiderItem, SiderItemChild } from "./Sider";

export type SiderMenuProps = {
  items: SiderItem[];
  onNavigation: (ev: { key: string }) => void;
};

export function SiderMenu({
  items,
  onNavigation,
}: SiderMenuProps): JSX.Element {
  const location = useLocation();

  const user = useCurrentUser();

  const renderSiderItem = useCallback(
    (item: SiderItem | SiderItemChild): JSX.Element => {
      if ("children" in item && item.children) {
        return (
          <Menu.SubMenu
            icon={item.icon}
            key={item.path.split("/")[1]}
            title={item.title}
          >
            {item.children.map((child) => renderSiderItem(child))}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item
            icon={"icon" in item && item.icon}
            key={item.path}
            onClick={onNavigation}
          >
            {item.title}
          </Menu.Item>
        );
      }
    },
    [onNavigation]
  );

  const itemsBySection = useMemo((): Record<
    SiderItem["section"],
    SiderItem[] | undefined
  > => {
    function getSectionItems(
      section: SiderItem["section"]
    ): SiderItem[] | undefined {
      const filtered = items.filter(
        (item) => (user || item.isPublic) && item.section === section
      );
      return filtered.length > 0 ? filtered : undefined;
    }

    return {
      1: getSectionItems(1),
      2: getSectionItems(2),
      admin: getSectionItems("admin"),
    };
  }, [items, user]);

  return (
    <Menu
      defaultOpenKeys={[location.pathname.split("/")[1]]}
      defaultSelectedKeys={[location.pathname.split("/").slice(0, 3).join("/")]}
      mode="inline"
      theme="dark"
    >
      {itemsBySection[1]?.map((item) => renderSiderItem(item))}

      {itemsBySection[2] && (
        <>
          <Menu.Divider />
          {itemsBySection[2].map((item) => renderSiderItem(item))}
        </>
      )}

      {itemsBySection.admin && user?.hasPrivileges("_super") && (
        <>
          <Menu.Divider />
          {itemsBySection.admin.map((adminItem) => renderSiderItem(adminItem))}
        </>
      )}
    </Menu>
  );
}
