import type { WebColor } from "../utils";
import type { Na3App, Na3AppId } from "./Na3App";
import type { Na3Machine } from "./Na3Machine";
import type { Na3Position } from "./Na3Position";
import type { Na3User } from "./user/Na3User";

export type Na3DepartmentType = "factory-adm" | "office" | "shop-floor";

export type Na3DepartmentIdMap = {
  "factory-adm": "administrativo" | "manutencao" | "pcp" | "qualidade";
  office: "comex" | "desenvolvimento" | "diretoria";
  "shop-floor":
    | "corte-solda-luva"
    | "corte-solda-saco"
    | "corte"
    | "dobra"
    | "ekoplasto"
    | "extrusao"
    | "flexografia-papel"
    | "flexografia-plastico"
    | "kit-automatico"
    | "kit-manual"
    | "off-set"
    | "reciclagem"
    | "super-kit";
};

export type Na3DepartmentId<T extends Na3DepartmentType = Na3DepartmentType> =
  Na3DepartmentIdMap[T];

export type Na3DepartmentLocationMap = {
  "factory-adm": "factory";
  office: "office";
  "shop-floor": "factory";
};

export type Na3DepartmentLocation<
  T extends Na3DepartmentType = Na3DepartmentType
> = Na3DepartmentLocationMap[T];

export type Na3DepartmentStyle = {
  colors: { background: string; text: string; web: WebColor };
};

export type Na3Department<T extends Na3DepartmentType = Na3DepartmentType> = {
  apps: Partial<Record<Na3AppId, Na3App>>;
  displayName: string;
  id: Na3DepartmentId<T>;
  location: Na3DepartmentLocation<T>;
  machines: T extends "shop-floor" ? Record<string, Na3Machine> | null : null;
  name: string;
  people: Na3User[];
  positions: Na3Position[];
  style: Na3DepartmentStyle;
  twoLetterId: T extends "shop-floor" ? string : null;
  type: T;
};
