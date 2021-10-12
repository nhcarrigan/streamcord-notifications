import { CommandInteraction } from "discord.js";

import { Bot } from "./Bot";

export type NotificationHandler = (
  BOT: Bot,
  interaction: CommandInteraction
) => Promise<void>;
