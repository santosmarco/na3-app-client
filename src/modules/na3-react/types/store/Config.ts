export type ConfigEnvironment = "development" | "production" | "test";

export type ConfigState = {
  environment: ConfigEnvironment;
  messagingTokensStorageKey: string;
};

export type ConfigSetEnvironmentAction = {
  environment: ConfigState["environment"];
  type: "CONFIG_SET_ENVIRONMENT";
};

export type ConfigSetMsgTokensStorageKeyAction = {
  key: ConfigState["messagingTokensStorageKey"];
  type: "CONFIG_SET_MSG_TOKENS_STORAGE_KEY";
};

export type ConfigAction =
  | ConfigSetEnvironmentAction
  | ConfigSetMsgTokensStorageKeyAction;
