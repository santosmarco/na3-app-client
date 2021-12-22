import type { Na3DepartmentId } from "./Na3Department";
import type { Na3UserPrivilegeId } from "./user/Na3UserPrivilege";

export type Na3PositionIdBase =
  | "analista-qualidade"
  | "assistente-compras-manutencao"
  | "assistente-compras-pcp"
  | "assistente-manutencao"
  | "assistente-pcp"
  | "assistente-reciclagem"
  | "auxiliar-extrusao"
  | "auxiliar-producao"
  | "coordenador-manutencao"
  | "cortador-guilhotina"
  | "desenvolvedor"
  | "diretor-financeiro"
  | "diretor-operacoes"
  | "eletricista-1"
  | "eletricista-2"
  | "encarregado-off-set"
  | "extrusor-1"
  | "extrusor-2"
  | "gerente-comex"
  | "gerente-ekoplasto"
  | "gerente-industrial"
  | "gerente-manutencao"
  | "impressor-flexo-1"
  | "impressor-flexo-2"
  | "inspetor-qualidade-1"
  | "inspetor-qualidade-2"
  | "lider-turno"
  | "mecanico-1"
  | "mecanico-2"
  | "operador-1"
  | "operador-2"
  | "operador-flexo"
  | "operador-mantenedor"
  | "operador-reciclagem-1"
  | "operador-reciclagem-2"
  | "serralheiro-industrial"
  | "supervisor-producao"
  | "supervisor-qualidade";

export type Na3PositionId<
  T extends Na3DepartmentId = Na3DepartmentId,
  U extends Na3PositionIdBase = Na3PositionIdBase
> = `${T}.${U}`;

export type Na3Position<
  T extends Na3DepartmentId = Na3DepartmentId,
  U extends Na3PositionIdBase = Na3PositionIdBase
> = {
  departmentId: Na3DepartmentId;
  id: Na3PositionId<T, U>;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
  name: string;
  privileges: Na3UserPrivilegeId[];
  shortName: string;
};
