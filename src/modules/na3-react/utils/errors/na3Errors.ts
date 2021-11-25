export type Na3ErrorCode =
  | "na3/auth/sign-up/user-already-exists"
  | "na3/auth/state-change/user-duplicate"
  | "na3/auth/state-change/user-not-found";

type Na3ErrorMessage = `${string}.`;

export type Na3Error = {
  code: Na3ErrorCode;
  message: Na3ErrorMessage;
  name: "Na3Error";
};

const errorDictionary: Record<Na3ErrorCode, Na3ErrorMessage> = {
  "na3/auth/sign-up/user-already-exists":
    "Já existe uma conta vinculada à matrícula informada.",
  "na3/auth/state-change/user-not-found":
    "Não foi encontrada nenhuma conta vinculada à sua matrícula. Sua conta pode ter sido removida ou desativada. Por favor, entre em contato com o administrador do sistema.",
  "na3/auth/state-change/user-duplicate":
    "Foram encontradas múltiplas contas vinculadas à sua matrícula. Por favor, entre em contato com o administrador do sistema.",
};

export function buildNa3Error(code: Na3ErrorCode): Na3Error {
  return { code, message: errorDictionary[code], name: "Na3Error" };
}
