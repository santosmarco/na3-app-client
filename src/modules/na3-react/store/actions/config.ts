import type { ConfigSetEnvironmentAction, ConfigState } from "../../types";

export const setConfigEnvironment = (
  environment: ConfigState["environment"]
): ConfigSetEnvironmentAction => ({
  environment,
  type: "CONFIG_SET_ENVIRONMENT",
});
