import { lime, red } from "@ant-design/colors";
import { AppstoreOutlined } from "@ant-design/icons";
import { MenuPage } from "@components";
import type { MenuPageAction } from "@types";
import React from "react";
import { IoAddOutline, IoGridOutline } from "react-icons/io5";

export function ProductsHomePage(): JSX.Element {
  return (
    <MenuPage
      icon={<AppstoreOutlined />}
      items={productsPageActions}
      title="Produtos"
    />
  );
}

const productsPageActions: MenuPageAction[] = [
  {
    colors: { background: red[2], foreground: red[8] },
    description: "Visualizar todos os produtos",
    href: "/produtos/lista",
    icon: <IoGridOutline />,
    title: "Todos os produtos",
  },
  {
    colors: { background: lime[2], foreground: lime[8] },
    description: "Criar um novo produto",
    href: "/produtos/criar",
    icon: <IoAddOutline />,
    title: "Criar produto",
  },
];
