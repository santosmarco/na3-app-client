import { blue, green, red } from "@ant-design/colors";
import { FileOutlined } from "@ant-design/icons";
import { MenuPage } from "@components";
import type { MenuPageAction } from "@types";
import React from "react";
import {
  IoBoatOutline,
  IoCubeOutline,
  IoDocumentsOutline,
} from "react-icons/io5";

export function DocsHomePage(): JSX.Element {
  return (
    <MenuPage
      icon={<FileOutlined />}
      items={docsPageActions}
      title="Documentos"
    />
  );
}

const docsPageActions: MenuPageAction[] = [
  {
    colors: { background: red[2], foreground: red[8] },
    description: "Emitir documentos de Transferência de Materiais",
    href: "/docs/transferencia",
    icon: <IoCubeOutline />,
    title: "Transferência",
  },
  {
    colors: { background: green[2], foreground: green[8] },
    description: "Emitir Invoices/Packing Lists",
    href: "/docs/comex",
    icon: <IoBoatOutline />,
    title: "Comércio Exterior",
  },
  {
    colors: { background: blue[2], foreground: blue[8] },
    description: "Visualizar modelos de normas, padrões e procedimentos",
    href: "/docs/normas",
    icon: <IoDocumentsOutline />,
    title: "Normas & Procedimentos",
  },
];
