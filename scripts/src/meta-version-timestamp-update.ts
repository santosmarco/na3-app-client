import { registerCommands, updateMetaVersionTimestamp } from "./utils";

const commands = registerCommands([
  { command: updateMetaVersionTimestamp, name: "update version timestamp" },
]);

void commands.run();
