import { green, red } from "@ant-design/colors";
import { SolutionOutlined } from "@ant-design/icons";
import { MenuPage } from "@components";
import type { MenuPageAction } from "@types";
import React from "react";
import { IoBriefcaseOutline, IoPeopleOutline } from "react-icons/io5";

export function AdminHomePage(): JSX.Element {
  return (
    <MenuPage
      icon={<SolutionOutlined />}
      items={adminPageActions}
      title="Admin"
    />
  );
}

const adminPageActions: MenuPageAction[] = [
  {
    colors: { background: red[2], foreground: red[8] },
    description: "Gerenciar/criar setores da empresa",
    href: "/admin/setores",
    icon: <IoBriefcaseOutline />,
    title: "Administrar setores",
  },
  {
    colors: { background: green[2], foreground: green[8] },
    description: "Gerenciar/criar usuários da plataforma",
    href: "/admin/usuarios",
    icon: <IoPeopleOutline />,
    title: "Administrar usuários",
  },
];
