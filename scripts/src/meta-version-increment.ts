import { incrementMetaVersion, registerCommands } from "./utils";

const commands = registerCommands([
  { command: incrementMetaVersion, name: "update version" },
]);

void commands.run();
