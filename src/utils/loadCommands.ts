import { readdir } from "fs/promises";
import { join } from "path";

import { Command } from "../interfaces/CommandInt";

import { errorHandler } from "./errorHandler";

/**
 * Reads the commands directory and dynamically imports the files,
 * then pushes the imported data to an array.
 *
 * @returns {Command[]} An array of imported commands.
 */
export const loadCommands = async (): Promise<Command[]> => {
  try {
    const result: Command[] = [];
    const files = await readdir(
      join(process.cwd() + "/prod/commands"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd() + `/prod/commands/${file}`));
      result.push(mod[name] as Command);
    }

    return result;
  } catch (error) {
    errorHandler("command loader", error);
    return [];
  }
};
