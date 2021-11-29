export type Na3ErrorCode =
  | "na3/auth/sign-up/user-already-exists"
  | "na3/auth/sign-up/user-not-created"
  | "na3/auth/state-change/user-duplicate"
  | "na3/auth/state-change/user-not-found"
  | "na3/firestore/generic/user-not-found"
  | "na3/user/update-password/not-signed-in"
  | "na3/user/update-password/user-not-found";

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
  "na3/user/update-password/not-signed-in":
    "Nenhum usuário encontrado. Por favor, faça o login antes de continuar.",
  "na3/auth/sign-up/user-not-created":
    "Um erro inesperado ocorreu e não foi possível criar uma conta para o usuário. Por favor, entre em contato com o desenvolvedor.",
  "na3/user/update-password/user-not-found":
    "Não foi encontrada nenhuma conta vinculada à sua matrícula. Sua conta pode ter sido removida ou desativada. Por favor, entre em contato com o administrador do sistema.",
  "na3/firestore/generic/user-not-found":
    "Você precisa entrar com a sua conta primeiro.",
};

export function buildNa3Error(code: Na3ErrorCode): Na3Error {
  return { code, message: errorDictionary[code], name: "Na3Error" };
}
