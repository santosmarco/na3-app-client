export type ConfigState = {
  environment: "development" | "production" | "test";
};

export type ConfigSetEnvironmentAction = {
  environment: ConfigState["environment"];
  type: "CONFIG_SET_ENVIRONMENT";
};

export type ConfigAction = ConfigSetEnvironmentAction;
