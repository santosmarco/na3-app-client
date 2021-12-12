import { detect as detectBrowser } from "detect-browser";

import type { Na3AppDevice } from "../../../na3-types";

type GetDeviceConfig = {
  appVersion: string | undefined;
};

export function getDevice(config: GetDeviceConfig | null): Na3AppDevice {
  const browser = detectBrowser();
  return {
    model: browser?.name || "Nova A3 App",
    name: "Nova A3 App",
    os: { name: browser?.os || "—", version: config?.appVersion || "?" },
  };
}
