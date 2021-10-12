import { Bot } from "../interfaces/Bot";
import { errorHandler } from "../utils/errorHandler";
import { logHandler } from "../utils/logHandler";

import NotificationModel from "./NotificationModel";

/**
 * Fetches notifications from the database and caches them.
 *
 * @param {Bot} bot The bot instance.
 */
export const getNotifications = async (bot: Bot): Promise<void> => {
  try {
    const list = await NotificationModel.find();

    list.forEach((notif) => {
      bot.notifications[notif.number] = notif;
    });

    logHandler.log("debug", "Cached notification data!");
  } catch (error) {
    errorHandler("cache notifications", error);
  }
};
