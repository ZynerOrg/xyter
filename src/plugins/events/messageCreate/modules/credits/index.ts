import { ChannelType, Message } from "discord.js";
import * as cooldown from "../../../../../helpers/cooldown";
import fetchGuild from "../../../../../helpers/fetchGuild";
import fetchUser from "../../../../../helpers/userData";
import logger from "../../../../../middlewares/logger";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (!guild) return;
    if (author.bot) return;
    if (channel.type !== ChannelType.GuildText) return;

    const { id: guildId } = guild;
    const { id: userId } = author;

    const guildData = await fetchGuild(guild);
    const userData = await fetchUser(author, guild);

    if (content.length < guildData.credits.minimumLength) return;

    const isOnCooldown = await cooldown.message(
      message,
      guildData.credits.timeout,
      "messageCreate-credits"
    );
    if (isOnCooldown) return;

    userData.credits += guildData.credits.rate;

    await userData
      .save()
      .then(async () => {
        logger.silly(
          `User ${userId} in guild ${guildId} has ${userData.credits} credits`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error saving credits for user ${userId} in guild ${guildId} - ${err}`
        );
      });
  },
};
