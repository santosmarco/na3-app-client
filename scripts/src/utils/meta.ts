import dayjs from "dayjs";

import type { AsyncCommandResult } from "./commands";
import { editFileAsync } from "./commands";

export function replaceMetaVariable(
  variable: "VERSION_TIMESTAMP" | "VERSION",
  updateOperation: (value: string) => string
): Promise<AsyncCommandResult> {
  return editFileAsync("./src/config/meta.ts", (content) => {
    const varRegex = new RegExp(`(APP_${variable}\\s*=\\s*")(.+)(")`);
    const match = varRegex.exec(content);
    const varValue = match?.[2];

    return varValue
      ? content.replace(varRegex, `$1${updateOperation(varValue)}$3`)
      : content;
  });
}

export async function updateMetaVersionTimestamp(): Promise<AsyncCommandResult> {
  return replaceMetaVariable("VERSION_TIMESTAMP", () => dayjs().format());
}

export async function incrementMetaVersion(): Promise<AsyncCommandResult> {
  return replaceMetaVariable("VERSION", (value) => {
    const versionChunks = value.split(".");
    const incrementableChunk = versionChunks[2];

    return `${versionChunks.slice(0, 2).join(".")}.${
      parseInt(incrementableChunk) + 1
    }`;
  });
}
