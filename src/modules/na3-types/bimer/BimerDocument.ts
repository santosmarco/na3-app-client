import type { BimerBase } from "./BimerBase";

type BimerDocItem = {
  Identificador: string;
  IdentificadorProduto: string;
  IdentificadorSetorEntrada?: string;
  IdentificadorSetorSaida: string;
  Quantidade: number;
  SerieLote?: {
    Codigo: string;
    Identificador: string;
    Tipo: "L" | "S";
  };
  ValorPesoBruto: number;
  ValorPesoLiquido: number;
  ValorUnitario: number;
};

type BimerDocPayment = {
  Aliquota: number;
  AliquotaConvenio: number;
  AliquotaTACConvenio: number;
  AliquotaTACEmpresa: number;
  AtualizaFinanceiro: boolean;
  DataVencimento: string;
  DescricaoAgrupamento: string;
  Identificador: string;
  IdentificadorFormaPagamento: string;
  IdentificadorNaturezaLancamento: string;
  IdentificadorPessoaConvenio?: string;
  IdentificadorPessoaFinanceiro?: string;
  IdentificadorTipoBaixa?: string;
  NomeAdquirenteCartao?: string;
  NumeroAutorizacaoCartao?: string;
  NumeroCheque: string;
  NumeroDias: number;
  NumeroDiasIntervalo: number;
  NumeroDiasPrimeiraParcelaVenda: number;
  NumeroDiasRecebimento: number;
  NumeroParcelas: number;
  NumeroParcelasRecebimento: number;
  NumeroSequencialUnicoCartao?: string;
  NumeroTitulo: number;
  Valor: number;
  ValorJurosPrazo: number;
  ValorTACConvenio: number;
  ValorTACEmpresa: number;
};

export type BimerDocument = {
  ChaveAcesso: string;
  CodigoEmpresa: string;
  DataEmissao: string;
  DataReferencia: string;
  DataReferenciaPagamento: string;
  DocumentoCancelado: boolean;
  Faturamento?: string;
  Identificador: string;
  IdentificadorLoteEstoque: string;
  IdentificadorOperacao: string;
  IdentificadorPessoa: string;
  Itens: BimerDocItem[];
  Liberado: boolean;
  Mensagens?: Array<BimerBase | null>;
  NomeEntidadeOrigem?: string;
  Numero: string;
  Observacao: string;
  Pagamentos: BimerDocPayment[];
  StatusDocumentoTelecomunicacao: string;
  StatusNotaFiscalEletronica:
    | "A"
    | "C"
    | "D"
    | "E"
    | "I"
    | "N"
    | "R"
    | "S"
    | "X";
  TipoDocumento: "C" | "F" | "N" | "O" | "S" | "T";
  TipoFinalidade: string;
  UnidadeNegocio?: BimerBase;
};
