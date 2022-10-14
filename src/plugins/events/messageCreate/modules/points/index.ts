import { ChannelType, Message } from "discord.js";
import { message as CooldownMessage } from "../../../../../helpers/cooldown";
import fetchGuild from "../../../../../helpers/guildData";
import fetchUser from "../../../../../helpers/userData";
import logger from "../../../../../middlewares/logger";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (!guild) return;
    if (author.bot) return;
    if (channel.type !== ChannelType.GuildText) return;

    const guildData = await fetchGuild(guild);
    const userData = await fetchUser(author, guild);

    if (content.length < guildData.credits.minimumLength) return;

    const isOnCooldown = await CooldownMessage(
      message,
      guildData.credits.timeout,
      "messageCreate-points"
    );
    if (isOnCooldown) return;

    userData.points += guildData.points.rate;

    await userData
      .save()
      .then(() => {
        logger.silly(
          `Successfully saved user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
        );
      })
      .catch(() => {
        throw new Error("Error saving points to database.");
      });

    logger.silly(
      `User ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id}) has ${userData.points} points`
    );
  },
};
