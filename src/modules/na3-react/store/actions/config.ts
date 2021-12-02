import type {
  ConfigSetEnvironmentAction,
  ConfigSetMsgTokensStorageKeyAction,
  ConfigState,
} from "../../types";

export const setConfigEnvironment = (
  environment: ConfigState["environment"]
): ConfigSetEnvironmentAction => ({
  environment,
  type: "CONFIG_SET_ENVIRONMENT",
});

export const setConfigMsgTokensStorageKey = (
  key: ConfigState["messagingTokensStorageKey"]
): ConfigSetMsgTokensStorageKeyAction => ({
  key,
  type: "CONFIG_SET_MSG_TOKENS_STORAGE_KEY",
});
