import {
  FileOutlined,
  HomeOutlined,
  SettingOutlined,
  SolutionOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";
import type { LiteralUnion } from "type-fest";

import type { Na3UserPrivilegeId } from "../modules/na3-types";
import {
  AdminHomePage,
  AdminUsersCreatePage,
  AdminUsersHomePage,
  AuthPage,
  DocsHomePage,
  DocTransfHomePage,
  HomePage,
  LabelsHomePage,
  LabelsManagePage,
  LabelsPrintPage,
  LabelsTransfCreateTemplatePage,
  LabelsTransfManagePage,
  LabelsTransfPrintPage,
  MaintDashboardHomePage,
  MaintenanceHomePage,
  MaintProjectsCreatePage,
  MaintProjectsHomePage,
  MaintServiceOrdersCreatePage,
  MaintServiceOrdersHomePage,
} from "../pages";

export type SiderConfig = {
  children?: SiderChild[];
  title?: string;
};

type SiderChild = {
  path: string;
  title: string;
};

export type AppRoute = {
  component: React.ReactNode | null;
  icon?: React.ReactNode;
  notExact?: boolean;
  requiredPrivileges: Na3UserPrivilegeId[] | null;
  siderConfig?: SiderConfig;
  title: string | null;
};

type AppRouteMap<Path extends string> = Readonly<
  Record<LiteralUnion<Path, string>, AppRoute>
>;

export const ROUTES: AppRouteMap<
  | "/"
  | "/admin/usuarios"
  | "/admin/usuarios/criar"
  | "/docs"
  | "/docs/comex"
  | "/docs/modelos"
  | "/docs/transferencia"
  | "/docs/transferencia/nova"
  | "/entrar"
  | "/etiquetas"
  | "/etiquetas/gerenciar"
  | "/etiquetas/gerenciar/transferencia"
  | "/etiquetas/gerenciar/transferencia/criar-modelo"
  | "/etiquetas/imprimir"
  | "/etiquetas/imprimir/transferencia"
  | "/manutencao"
  | "/manutencao/dashboard"
  | "/manutencao/os"
  | "/manutencao/os/abrir-os"
  | "/manutencao/predprev"
  | "/manutencao/predprev/nova-predprev"
  | "/manutencao/projetos"
  | "/manutencao/projetos/novo-projeto"
> = {
  "/": {
    component: <HomePage />,
    icon: <HomeOutlined />,
    requiredPrivileges: null,
    siderConfig: { title: "Início" },
    title: null,
  },

  "/admin": {
    component: <AdminHomePage />,
    icon: <SolutionOutlined />,
    requiredPrivileges: ["_super"],
    siderConfig: {
      children: [
        { path: "/admin/setores", title: "Setores" },
        { path: "/admin/usuarios", title: "Usuários" },
      ],
    },
    title: "Admin",
  },
  "/admin/setores": {
    component: null,
    requiredPrivileges: ["_super"],
    title: "Setores",
  },
  "/admin/usuarios": {
    component: <AdminUsersHomePage />,
    requiredPrivileges: ["_super"],
    title: "Usuários",
  },
  "/admin/usuarios/criar": {
    component: <AdminUsersCreatePage />,
    requiredPrivileges: ["_super"],
    title: "Criar Usuário",
  },

  "/docs": {
    component: <DocsHomePage />,
    icon: <FileOutlined />,
    requiredPrivileges: null,
    siderConfig: {
      children: [
        { path: "/docs/transferencia", title: "Transferência" },
        { path: "/docs/comex", title: "Comércio Exterior" },
        { path: "/docs/modelos", title: "Modelos" },
      ],
    },
    title: "Documentos",
  },
  "/docs/comex": {
    component: null,
    requiredPrivileges: null,
    title: "Comércio Exterior",
  },
  "/docs/modelos": {
    component: null,
    requiredPrivileges: null,
    title: "Modelos",
  },
  "/docs/transferencia": {
    component: <DocTransfHomePage />,
    requiredPrivileges: null,
    title: "Transferência",
  },
  "/docs/transferencia/nova": {
    component: null,
    requiredPrivileges: null,
    title: "Nova Transferência",
  },

  "/entrar": {
    component: <AuthPage />,
    icon: <UserOutlined />,
    requiredPrivileges: null,
    title: "Entrar",
  },

  "/etiquetas": {
    component: <LabelsHomePage />,
    icon: <TagsOutlined />,
    requiredPrivileges: null,
    siderConfig: {
      children: [
        { path: "/etiquetas/imprimir", title: "Imprimir" },
        { path: "/etiquetas/gerenciar", title: "Gerenciar" },
      ],
    },
    title: "Etiquetas",
  },
  "/etiquetas/gerenciar": {
    component: <LabelsManagePage />,
    requiredPrivileges: ["labels_transf_manage_all"],
    title: "Gerenciar",
  },
  "/etiquetas/gerenciar/transferencia": {
    component: <LabelsTransfManagePage />,
    requiredPrivileges: ["labels_transf_manage_all"],
    title: "Transferência",
  },
  "/etiquetas/gerenciar/transferencia/criar-modelo": {
    component: <LabelsTransfCreateTemplatePage />,
    requiredPrivileges: ["labels_transf_manage_all"],
    title: "Novo Modelo",
  },
  "/etiquetas/imprimir": {
    component: <LabelsPrintPage />,
    requiredPrivileges: ["labels_transf_print_own"],
    title: "Imprimir",
  },
  "/etiquetas/imprimir/transferencia": {
    component: <LabelsTransfPrintPage />,
    requiredPrivileges: ["labels_transf_print_own"],
    title: "Transferência",
  },

  "/manutencao": {
    component: <MaintenanceHomePage />,
    icon: <SettingOutlined />,
    requiredPrivileges: null,
    siderConfig: {
      children: [
        { path: "/manutencao/os", title: "Ordens de Serviço" },
        { path: "/manutencao/dashboard", title: "Dashboard" },
        { path: "/manutencao/projetos", title: "Projetos" },
        { path: "/manutencao/predprev", title: "Pred/Prev/Lub" },
      ],
    },
    title: "Manutenção",
  },
  "/manutencao/dashboard": {
    component: <MaintDashboardHomePage />,
    requiredPrivileges: [
      "service_orders_read_all",
      "service_orders_write_maintenance",
    ],
    title: "Dashboard",
  },
  "/manutencao/os": {
    component: <MaintServiceOrdersHomePage />,
    requiredPrivileges: ["service_orders_read"],
    title: "Ordens de Serviço",
  },
  "/manutencao/os/abrir-os": {
    component: <MaintServiceOrdersCreatePage />,
    requiredPrivileges: ["service_orders_write_shop_floor"],
    title: "Abrir OS",
  },
  "/manutencao/predprev": {
    component: <MaintProjectsHomePage isPredPrev={true} />,
    requiredPrivileges: ["maint_projects_read_all", "maint_projects_write_all"],
    title: "Pred/Prev",
  },
  "/manutencao/predprev/nova-predprev": {
    component: <MaintProjectsCreatePage isPredPrev={true} />,
    requiredPrivileges: ["maint_projects_write_all"],
    title: "Nova Pred/Prev",
  },
  "/manutencao/projetos": {
    component: <MaintProjectsHomePage isPredPrev={false} />,
    requiredPrivileges: ["maint_projects_read_all", "maint_projects_write_all"],
    title: "Projetos",
  },
  "/manutencao/projetos/novo-projeto": {
    component: <MaintProjectsCreatePage isPredPrev={false} />,
    requiredPrivileges: ["maint_projects_write_all"],
    title: "Novo Projeto",
  },
};
