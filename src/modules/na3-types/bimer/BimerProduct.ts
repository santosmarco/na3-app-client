import type { BimerBase } from "./BimerBase";

export type BimerProduct = {
  Ativo?: boolean;
  AtivoCompra?: boolean;
  CaracteristicasProduto: {
    Caracteristica: string;
    Codigo: string;
    Identificador: string;
  }[];
  ClassificacaoFiscal?: BimerBase & {
    AliquotaTotalTributosPrecedentes: number;
    Classificacao: string;
  };
  Codigo: string;
  CodigoClassificacao?: string;
  Dimensoes: {
    Altura: number;
    Diametro: number;
    Largura: number;
    Profundidade: number;
    TipoEmbalagem: string;
  };
  Familia: BimerBase;
  FatorConversaoUnidade: number;
  Grupo: BimerBase;
  Identificador: string;
  IdentificadorProdutoMaster?: string;
  IdentificadorProdutoOrigem?: string;
  MarcasProduto: { Codigo: string; Identificador: string; NomeMarca: string }[];
  Nome: string;
  PesoBruto: number;
  PesoLiquido: number;
  ProdutoAplicacao?: string;
  QuantidadeVolumes: number;
};
