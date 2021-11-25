import { Menu } from "antd";
import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useNa3User } from "../../../modules/na3-react";
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

  const user = useNa3User();

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

  return (
    <Menu
      defaultOpenKeys={[location.pathname.split("/")[1]]}
      defaultSelectedKeys={[location.pathname.split("/").slice(0, 3).join("/")]}
      mode="inline"
      theme="dark"
    >
      {items
        .filter((item) => !item?.superOnly)
        .map((publicItem) => renderSiderItem(publicItem))}

      {user?.hasPrivileges("_super") && (
        <>
          <Menu.Divider />

          {items
            .filter((item) => item?.superOnly)
            .map((adminItem) => renderSiderItem(adminItem))}
        </>
      )}
    </Menu>
  );
}
