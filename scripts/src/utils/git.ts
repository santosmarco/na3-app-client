import type { AsyncCommandResult } from "./commands";
import { execAsync } from "./commands";
import { replaceMetaVariable } from "./meta";

export async function gitCommitPush(): Promise<AsyncCommandResult> {
  return replaceMetaVariable("VERSION", (value) => {
    void (async (): Promise<void> => {
      await execAsync(`git add . && git commit -m "v${value}" && git push`);
    })();

    return value;
  });
}
