export type BimerContact = {
  ContatoPrincipal?: boolean;
  Email?: string;
  EmailBoleto?: string;
  EmailCobranca?: string;
  EmailNfEletronica?: string;
  Fax?: string;
  Identificador: string;
  Nome: string;
  PaginaInternet?: string;
  Suporte?: string;
  TelefoneCelular?: string;
  TelefoneFixo?: string;
  TipoCadastro?: "A" | "E" | "I";
};
