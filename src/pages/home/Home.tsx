import { blue, green, magenta, red } from "@ant-design/colors";
import { Logo, StaticListItem } from "@components";
import { useCurrentUser } from "@modules/na3-react";
import type { MenuPageAction } from "@types";
import { Col, Divider, Row } from "antd";
import { nanoid } from "nanoid";
import React from "react";
import {
  IoDocumentTextOutline,
  IoPersonCircleOutline,
  IoPricetagsOutline,
  IoSettingsOutline,
} from "react-icons/io5";

import classes from "./Home.module.css";

export function HomePage(): JSX.Element {
  const user = useCurrentUser();

  return (
    <>
      {user && <Logo className={classes.Logo} />}

      <div>
        <Divider orientation="left">Acesso rápido</Divider>
      </div>

      <Row
        gutter={[
          { xs: 8, sm: 8, md: 10, lg: 12 },
          { xs: 8, sm: 8, md: 16 },
        ]}
      >
        {getQuickLinks(!!user).map(
          ({ title, icon, colors, description, href }) => (
            <Col key={nanoid()} md={href === "/entrar" ? 24 : 8} xs={24}>
              <StaticListItem
                cardClassName={classes.QuickLink}
                colors={colors}
                description={description}
                href={href}
                icon={icon}
                title={title}
              />
            </Col>
          )
        )}
      </Row>
    </>
  );
}

const defaultQuickLinks: MenuPageAction[] = [
  {
    colors: { background: red[2], foreground: red[8] },
    description:
      "Emita documentos diversos, como o de Transferência de Materiais",
    href: "/docs",
    icon: <IoDocumentTextOutline />,
    title: "Documentos",
  },
  {
    colors: { background: green[2], foreground: green[8] },
    description: "Imprima etiquetas a partir de modelos pré-definidos pelo PCP",
    href: "/etiquetas",
    icon: <IoPricetagsOutline />,
    title: "Etiquetas",
  },
  {
    colors: { background: blue[2], foreground: blue[8] },
    description:
      "Gerencie ou abra ordens de serviço para o setor de Manutenção",
    href: "/manutencao",
    icon: <IoSettingsOutline />,
    title: "Manutenção",
  },
];

const authQuickLink: MenuPageAction = {
  colors: { background: magenta[2], foreground: magenta[8] },
  description: "Faça login para usar as funcionalidades exclusivas",
  href: "/entrar",
  icon: <IoPersonCircleOutline />,
  title: "Entrar",
};

function getQuickLinks(isAuthenticated: boolean): MenuPageAction[] {
  if (isAuthenticated) {
    return defaultQuickLinks;
  }
  return [authQuickLink, ...defaultQuickLinks];
}
