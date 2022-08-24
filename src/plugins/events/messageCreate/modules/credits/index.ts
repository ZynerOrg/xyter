import logger from "../../../../../middlewares/logger";
import { Message } from "discord.js";

import fetchUser from "../../../../../helpers/fetchUser";
import fetchGuild from "../../../../../helpers/fetchGuild";

import * as cooldown from "../../../../../helpers/cooldown";

export default {
  execute: async (message: Message) => {
    const { guild, author, content, channel } = message;

    if (guild == null) return;
    if (author.bot) return;
    if (channel?.type !== "GUILD_TEXT") return;

    const { id: guildId } = guild;
    const { id: userId } = author;

    const guildData = await fetchGuild(guild);
    const userData = await fetchUser(author, guild);

    if (content.length < guildData.credits.minimumLength) return;

    await cooldown.message(
      message,
      guildData.credits.timeout,
      "messageCreate-credits"
    );

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
