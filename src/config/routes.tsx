import {
  FileOutlined,
  HomeOutlined,
  SettingOutlined,
  SolutionOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { Na3UserPrivilegeId } from "@modules/na3-types";
import {
  AdminHomePage,
  AdminUsersCreatePage,
  AdminUsersHomePage,
  AuthPage,
  DocsHomePage,
  DocsStdCreatePage,
  DocsStdHomePage,
  HomePage,
  LabelsHomePage,
  LabelsManagePage,
  LabelsPrintPage,
  LabelsTransfCreateTemplatePage,
  LabelsTransfManagePage,
  LabelsTransfPrintPage,
  MaintDashboardHomePage,
  MaintenanceHomePage,
  MaintProjectsCalendarPage,
  MaintProjectsCreatePage,
  MaintProjectsHomePage,
  MaintReportsHomePage,
  MaintServiceOrdersCreatePage,
  MaintServiceOrdersHomePage,
  UserProfilePage,
  UsersHomePage,
} from "@pages";
import React from "react";
import type { SiderItem } from "src/components/layout/sider/Sider";

type SiderChildConfig = {
  path: string;
  title: string;
};

export type SiderConfig = {
  children?: SiderChildConfig[];
  section?: Exclude<SiderItem["section"], "admin">;
  title?: string;
};

export type AppRoutePath =
  | "/"
  | "/admin"
  | "/admin/setores"
  | "/admin/usuarios"
  | "/admin/usuarios/criar"
  | "/conta"
  | "/docs"
  | "/docs/comex"
  | "/docs/normas"
  | "/docs/normas/novo"
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
  | "/manutencao/calendario"
  | "/manutencao/dashboard"
  | "/manutencao/os"
  | "/manutencao/os/abrir-os"
  | "/manutencao/predprev"
  | "/manutencao/predprev/nova-predprev"
  | "/manutencao/projetos"
  | "/manutencao/projetos/novo-projeto"
  | "/manutencao/relatorios"
  | "/usuarios";

export type AppRoute = {
  component: React.ReactNode | null;
  headTitle?: string;
  icon?: React.ReactNode;
  notExact?: boolean;
  siderConfig?: SiderConfig;
  title: string | null;
} & (
  | {
      isPublic?: undefined;
      requiredPrivileges:
        | Na3UserPrivilegeId[]
        | ((userPrivileges: Na3UserPrivilegeId[]) => boolean)
        | { every?: boolean; privileges: Na3UserPrivilegeId[] };
    }
  | { isPublic: boolean; requiredPrivileges: null }
);

export const ROUTES: Record<AppRoutePath, AppRoute> = {
  "/": {
    component: <HomePage />,
    icon: <HomeOutlined />,
    requiredPrivileges: null,
    isPublic: true,
    siderConfig: { title: "In??cio" },
    title: null,
  },

  "/admin": {
    component: <AdminHomePage />,
    icon: <SolutionOutlined />,
    requiredPrivileges: ["_super"],
    siderConfig: {
      children: [
        { path: "/admin/setores", title: "Setores" },
        { path: "/admin/usuarios", title: "Usu??rios" },
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
    title: "Usu??rios",
  },
  "/admin/usuarios/criar": {
    component: <AdminUsersCreatePage />,
    requiredPrivileges: ["_super"],
    title: "Criar Usu??rio",
  },

  "/conta": {
    component: <UserProfilePage asAccountPage={true} />,
    requiredPrivileges: null,
    icon: <UserOutlined />,
    title: "Conta",
    isPublic: false,
    siderConfig: { section: 2 },
  },

  "/docs": {
    component: <DocsHomePage />,
    icon: <FileOutlined />,
    requiredPrivileges: null,
    isPublic: true,
    siderConfig: {
      children: [
        { path: "/docs/transferencia", title: "Transfer??ncia" },
        { path: "/docs/comex", title: "Com??rcio Exterior" },
        { path: "/docs/normas", title: "Normas/Procedimentos" },
      ],
    },
    title: "Documentos",
    headTitle: "Docs",
  },
  "/docs/comex": {
    component: null,
    requiredPrivileges: null,
    isPublic: true,
    title: "Com??rcio Exterior",
  },
  "/docs/normas": {
    component: <DocsStdHomePage />,
    requiredPrivileges: {
      privileges: [
        "docs_std_read_own",
        "docs_std_read_all",
        "docs_std_write_new",
      ],
      every: false,
    },
    title: "Normas/Procedimentos",
  },
  "/docs/normas/novo": {
    component: <DocsStdCreatePage />,
    requiredPrivileges: ["docs_std_write_new"],
    title: "Novo Documento",
  },
  "/docs/transferencia": {
    component: null,
    requiredPrivileges: null,
    isPublic: true,
    title: "Transfer??ncia",
  },
  "/docs/transferencia/nova": {
    component: null,
    requiredPrivileges: null,
    isPublic: true,
    title: "Nova Transfer??ncia",
  },

  "/entrar": {
    component: <AuthPage redirectUrl="/" />,
    icon: <UserOutlined />,
    requiredPrivileges: null,
    isPublic: true,
    title: "Entrar",
  },

  "/etiquetas": {
    component: <LabelsHomePage />,
    icon: <TagsOutlined />,
    requiredPrivileges: null,
    isPublic: true,
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
    title: "Transfer??ncia",
  },
  "/etiquetas/gerenciar/transferencia/criar-modelo": {
    component: <LabelsTransfCreateTemplatePage />,
    requiredPrivileges: ["labels_transf_manage_all"],
    title: "Novo Modelo",
  },
  "/etiquetas/imprimir": {
    component: <LabelsPrintPage />,
    requiredPrivileges: {
      privileges: ["labels_transf_print_own", "labels_transf_print_all"],
      every: false,
    },
    title: "Imprimir",
  },
  "/etiquetas/imprimir/transferencia": {
    component: <LabelsTransfPrintPage />,
    requiredPrivileges: {
      privileges: ["labels_transf_print_own", "labels_transf_print_all"],
      every: false,
    },
    title: "Transfer??ncia",
  },

  "/manutencao": {
    component: <MaintenanceHomePage />,
    icon: <SettingOutlined />,
    requiredPrivileges: null,
    isPublic: true,
    siderConfig: {
      children: [
        { path: "/manutencao/os", title: "Ordens de Servi??o" },
        { path: "/manutencao/dashboard", title: "Dashboard" },
        { path: "/manutencao/projetos", title: "Projetos" },
        { path: "/manutencao/predprev", title: "Pred/Prev/Lub" },
        { path: "/manutencao/relatorios", title: "Relat??rios" },
      ],
    },
    title: "Manuten????o",
  },
  "/manutencao/dashboard": {
    component: <MaintDashboardHomePage />,
    requiredPrivileges: ["service_orders_read_all"],
    title: "Dashboard",
  },
  "/manutencao/calendario": {
    component: <MaintProjectsCalendarPage />,
    requiredPrivileges: ["service_orders_read_all"],
    title: "Calend??rio",
  },
  "/manutencao/os": {
    component: <MaintServiceOrdersHomePage />,
    requiredPrivileges: {
      privileges: ["service_orders_read_own", "service_orders_read_all"],
      every: false,
    },
    title: "Ordens de Servi??o",
  },
  "/manutencao/os/abrir-os": {
    component: <MaintServiceOrdersCreatePage />,
    requiredPrivileges: ["service_orders_write_shop_floor"],
    title: "Abrir OS",
  },
  "/manutencao/predprev": {
    component: <MaintProjectsHomePage isPredPrev={true} />,
    requiredPrivileges: ["maint_projects_read_all"],
    title: "Pred/Prev",
  },
  "/manutencao/predprev/nova-predprev": {
    component: <MaintProjectsCreatePage isPredPrev={true} />,
    requiredPrivileges: ["maint_projects_write_all"],
    title: "Nova Pred/Prev",
  },
  "/manutencao/projetos": {
    component: <MaintProjectsHomePage isPredPrev={false} />,
    requiredPrivileges: ["maint_projects_read_all"],
    title: "Projetos",
  },
  "/manutencao/projetos/novo-projeto": {
    component: <MaintProjectsCreatePage isPredPrev={false} />,
    requiredPrivileges: ["maint_projects_write_all"],
    title: "Novo Projeto",
  },
  "/manutencao/relatorios": {
    component: <MaintReportsHomePage />,
    requiredPrivileges: ["maint_reports_full_access"],
    title: "Relat??rios",
  },

  "/usuarios": {
    component: <UsersHomePage />,
    icon: <UserOutlined />,
    requiredPrivileges: null,
    isPublic: true,
    title: "Perfil de usu??rio",
  },
};

export function isAppRoutePath(test: unknown): test is AppRoutePath {
  return typeof test === "string" && test in ROUTES;
}
