import logger from "../../../../../middlewares/logger";

import * as cooldown from "../../../../../helpers/cooldown";

import fetchUser from "../../../../../helpers/fetchUser";
import fetchGuild from "../../../../../helpers/fetchGuild";

import { ChannelType, Message } from "discord.js";
export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (guild == null) return;
    if (author.bot) return;
    if (channel.type !== ChannelType.GuildText) return;

    const guildData = await fetchGuild(guild);
    const userData = await fetchUser(author, guild);

    if (content.length < guildData.credits.minimumLength) return;

    const isOnCooldown = await cooldown.message(
      message,
      guildData.credits.timeout,
      "messageCreate-points"
    );
    if (isOnCooldown) return;

    userData.points += guildData.points.rate;

    await userData
      .save()
      .then(async () => {
        logger.silly(
          `Successfully saved user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
        );
      })
      .catch(async (err) => {
        logger.error(
          `Error saving points for user ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`,
          err
        );
      });

    logger.silly(
      `User ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id}) has ${userData.points} points`
    );
  },
};
