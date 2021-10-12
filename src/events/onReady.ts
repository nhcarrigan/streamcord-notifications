import { connectDatabase } from "../database/connect";
import { getNotifications } from "../database/getNotifications";
import { Bot } from "../interfaces/Bot";
import { logHandler } from "../utils/logHandler";
import { scheduleReminder } from "../utils/scheduleReminder";

/**
 * Handles the ready event from Discord.
 *
 * @param {Bot} bot The bot instance.
 */
export const onReady = async (bot: Bot): Promise<void> => {
  await connectDatabase();
  await getNotifications(bot);
  const notifications = Object.values(bot.notifications);
  for (const notif of notifications) {
    scheduleReminder(notif, bot);
  }
  logHandler.log("debug", "Bot is online!");
};
