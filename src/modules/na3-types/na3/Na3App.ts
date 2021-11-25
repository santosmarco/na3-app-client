export type Na3AppId = "manut" | "transf";

export type Na3App = {
  id: Na3AppId;
  pushTokens: string[];
};

export type Na3AppDevice = {
  model: string;
  name: string;
  os: { name: string; version: string };
};
