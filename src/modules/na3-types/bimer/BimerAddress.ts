import type { BimerContact } from "./BimerContact";

export type BimerAddress = {
  Ativo: boolean;
  Bairro?: { Codigo: string; Identificador: string; Nome: string };
  BairroCidadeUnidadeFederativaCep: string;
  Cep?: string;
  Cidade?: {
    Codigo: string;
    CodigoDDD: string;
    CodigoIBGE: string;
    Identificador: string;
    Nome: string;
    UF?: {
      CodigoIBGE: number;
      Nome: string;
      Sigla: string;
    };
  };
  Codigo: string;
  CodigoSuframa: string;
  Complemento: string;
  ContatoPrincipal?: BimerContact;
  InscricaoEstadual: string;
  InscricaoMunicipal: string;
  Latitude: number;
  Longitude: number;
  NomeLogradouro: string;
  NumeroLogradouro: string;
  Observacao: string;
  PessoasContato: BimerContact[];
  Status?: string;
  TipoContribuicaoICMS: "1" | "2" | "9";
  TipoLogradouro?: { Identificador: string; Nome: string };
  TipoNomeNumeroComplementoLogradouro: string[];
  TiposEnderecos: string[];
  Uf: string;
};
