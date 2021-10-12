import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { Bot } from "./Bot";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  /**
   * Handles the logic for running a given command.
   *
   * @param {Bot} BOT BOT's Discord instance.
   * @param {CommandInteraction} interaction The interaction payload from Discord.
   */
  run: (BOT: Bot, interaction: CommandInteraction) => Promise<void>;
}
