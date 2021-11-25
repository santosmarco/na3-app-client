import type { BimerAddress } from "./BimerAddress";
import type { BimerContact } from "./BimerContact";
import type { BimerImage } from "./BimerImage";

type BimerPersonCategory = {
  Ativo: boolean;
  CodigoExterno: string;
  Identificador: string;
  Nome: string;
};

export type BimerPerson = {
  AliquotaIRRF?: number;
  Categorias: BimerPersonCategory[];
  Codigo: string;
  CpfCnpj?: number;
  DataCadastro: string;
  DataInicioAtividades: string;
  DataNascimento?: string;
  EnderecoPrincipal?: BimerAddress;
  Enderecos: BimerAddress[];
  EntidadeAdministracaoPublicaFederal?: boolean;
  FotoPessoa?: BimerImage;
  Identificador: string;
  InformacoesRestritas?: boolean;
  Nome: string;
  NomeCurto: string;
  PossuiCaracteristicaInadimplencia?: boolean;
  PrestadoraServico?: boolean;
  RepresentantePrincipalRelacionado?: BimerContact;
  RetemTributosContribuicoes?: boolean;
  RetemTributosDeQualquerValor?: boolean;
  TipoClienteTelecomunicacao: string;
  TipoPessoa: 0 | 1;
};
