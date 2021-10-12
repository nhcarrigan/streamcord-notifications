/* eslint-disable jsdoc/require-jsdoc */
import NotificationModel from "../database/NotificationModel";
import { NotificationHandler } from "../interfaces/NotificationHandler";
import { errorHandler } from "../utils/errorHandler";

export const deleteNotification: NotificationHandler = async (
  BOT,
  interaction
) => {
  try {
    const target = interaction.options.getNumber("number", true);

    if (!BOT.notifications[target]) {
      await interaction.editReply({
        content: "I cannot find a notification matching that number.",
      });
      return;
    }

    const dataTarget = await NotificationModel.findOne({ number: target });

    await dataTarget?.delete();

    delete BOT.notifications[target];

    clearInterval(BOT.intervals[target]);

    await interaction.editReply({
      content: `Deleted the #${dataTarget?.number} notification in <#${dataTarget?.channelId}>`,
    });
  } catch (error) {
    errorHandler("delete notification", error);
  }
};
