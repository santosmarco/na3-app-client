import { red } from "@ant-design/colors";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { MenuPage } from "@components";
import type { MenuPageAction } from "@types";
import React from "react";
import { IoReaderOutline } from "react-icons/io5";

export function ProductionOrdersHomePage(): JSX.Element {
  return (
    <MenuPage
      icon={<AppstoreAddOutlined />}
      items={productionOrdersPageActions}
      title="Ordens de produção"
    />
  );
}

const productionOrdersPageActions: MenuPageAction[] = [
  {
    colors: { background: red[2], foreground: red[8] },
    description: "Gerenciar/criar as ordens de produção",
    href: "/ordens-de-producao",
    icon: <IoReaderOutline />,
    title: "Ordens de produção",
  },
];
