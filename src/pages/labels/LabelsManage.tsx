import { red } from "@ant-design/colors";
import { MenuPage } from "@components";
import type { MenuPageAction } from "@types";
import React from "react";
import { IoPricetagsOutline } from "react-icons/io5";

export function LabelsManagePage(): JSX.Element {
  return (
    <MenuPage
      description="Selecione um grupo de modelos de etiqueta para gerenciar."
      items={labelTemplateGroups}
      title="Etiquetas • Gerenciar"
    />
  );
}

const labelTemplateGroups: MenuPageAction[] = [
  {
    colors: { background: red[2], foreground: red[8] },
    description: "Gerenciar modelos das etiquetas de transferência",
    href: "/etiquetas/gerenciar/transferencia",
    icon: <IoPricetagsOutline />,
    title: "Transferência",
  },
];
