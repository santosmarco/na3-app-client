import chalk from "chalk";
import type { ExecException } from "child_process";
import { exec } from "child_process";
import fs from "fs";
import ora from "ora";
import path from "path";

export type AsyncCommandResult = {
  error: ExecException | NodeJS.ErrnoException | null;
};

type CommandConfig = {
  command: string | (() => AsyncCommandResult | Promise<AsyncCommandResult>);
  name: string;
};

type CommandRegistry = {
  run: () => Promise<void>;
};

function getRootPath(): string {
  const pathChunks = __dirname.split("/");
  return pathChunks.slice(0, pathChunks.indexOf("scripts")).join("/");
}

export function execAsync(command: string): Promise<AsyncCommandResult> {
  return new Promise<AsyncCommandResult>((resolve) => {
    exec(command, { cwd: getRootPath() }, (error) => {
      resolve({ error });
    });
  });
}

export async function editFileAsync(
  filePath: string,
  editOperation: (data: string) => string
): Promise<AsyncCommandResult> {
  const resolvedFilePath = path.resolve(getRootPath(), filePath);

  return new Promise<AsyncCommandResult>((resolve) => {
    fs.readFile(resolvedFilePath, "utf-8", (error, fileData) => {
      if (error) {
        resolve({ error });
        return;
      }

      const updatedFileData = editOperation(fileData);

      fs.writeFile(resolvedFilePath, updatedFileData, "utf-8", (error) => {
        resolve({ error });
      });
    });
  });
}

async function runCommand(
  name: CommandConfig["name"],
  command: CommandConfig["command"]
): Promise<void> {
  function spinnerText(body: string): string {
    return `${chalk.bold("[" + name.trim().toUpperCase() + "]")} ${body}`;
  }

  const spinner = ora().start(spinnerText("Running..."));

  const execResult = await (typeof command === "string"
    ? execAsync(command)
    : command());

  if (execResult.error) {
    spinner.fail(
      spinnerText(`${chalk.italic("Error: " + execResult.error.message)}`)
    );
    process.exit(1);
  } else {
    spinner.succeed(spinnerText("Done!"));
  }
}

export function registerCommands(commands: CommandConfig[]): CommandRegistry {
  const immutableCommands = [...commands];

  async function runCommands(): Promise<void> {
    for (const { name, command } of immutableCommands) {
      await runCommand(name, command);
    }
  }

  return { run: runCommands };
}
