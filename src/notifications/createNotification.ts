/* eslint-disable jsdoc/require-jsdoc */
import { GuildChannel, MessageEmbed } from "discord.js";

import NotificationModel from "../database/NotificationModel";
import { NotificationHandler } from "../interfaces/NotificationHandler";
import { errorHandler } from "../utils/errorHandler";
import { scheduleReminder } from "../utils/scheduleReminder";

export const createNotification: NotificationHandler = async (
  BOT,
  interaction
) => {
  try {
    const channel = interaction.options.getChannel(
      "channel",
      true
    ) as GuildChannel;
    const time = interaction.options.getNumber("time", true);
    const content = interaction.options.getString("content", true);

    if (!["GUILD_TEXT", "GUILD_NEWS"].includes(channel.type)) {
      await interaction.editReply({
        content: "I can only send notifications in text channels.",
      });
      return;
    }

    if (
      !interaction.guild?.me?.permissionsIn(channel).has("SEND_MESSAGES") ||
      !interaction.guild?.me?.permissionsIn(channel).has("VIEW_CHANNEL")
    ) {
      await interaction.editReply({
        content: "I don't have permission to send messages in this channel.",
      });
      return;
    }

    if (time < 10) {
      await interaction.editReply({
        content:
          "To avoid rate limits, I cannot schedule notifications with a frequency of less than 10 minutes.",
      });
      return;
    }

    if (Object.values(BOT.notifications).length >= 50) {
      await interaction.editReply({
        content:
          "I can only handle 50 notifications at a time. Please clear out some existing notifications first.",
      });
    }

    const highestNumber = Object.values(BOT.notifications)
      .map((el) => el.number)
      .sort((a, b) => b - a)[0];

    const newNumber = highestNumber + 1 || 1;

    const newNotification = await NotificationModel.create({
      number: newNumber,
      channelId: channel.id,
      frequency: time,
      content,
      guildId: interaction.guildId,
    });

    // eslint-disable-next-line require-atomic-updates
    BOT.notifications[newNumber] = newNotification;

    const createdEmbed = new MessageEmbed();
    createdEmbed.setTitle("Notification created");
    createdEmbed.setDescription("The following notification was created:");
    createdEmbed.addField("Notification Channel", `<#${channel.id}>`);
    createdEmbed.addField("Frequency", `${time} minutes`);
    createdEmbed.addField("Content", content);
    createdEmbed.setFooter(`Notification #${newNumber}`);

    await interaction.editReply({ embeds: [createdEmbed] });

    scheduleReminder(newNotification, BOT);
  } catch (error) {
    errorHandler("create notification", error);
  }
};
