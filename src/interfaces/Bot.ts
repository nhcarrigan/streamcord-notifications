import { Client } from "discord.js";

import { NotificationInt } from "../database/NotificationModel";

import { Command } from "./CommandInt";

export interface Bot extends Client {
  token: string;
  notifications: { [key: number]: NotificationInt };
  intervals: { [key: number]: NodeJS.Timeout };
  commands: Command[];
  botId: string;
  homeId: string;
}
