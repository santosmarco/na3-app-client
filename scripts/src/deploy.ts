import {
  gitCommitPush,
  incrementMetaVersion,
  registerCommands,
  updateMetaVersionTimestamp,
} from "./utils";

const commands = registerCommands([
  { command: updateMetaVersionTimestamp, name: "update version timestamp" },
  { command: "yarn prettier --write src/", name: "prettier" },
  { command: "yarn eslint src/ --fix --ext .ts,.tsx", name: "eslint" },
  { command: "yarn build", name: "build" },
  { command: "firebase deploy --only hosting:novaa3", name: "deploy" },
  { command: gitCommitPush, name: "git push" },
  { command: incrementMetaVersion, name: "update version" },
]);

void commands.run();
