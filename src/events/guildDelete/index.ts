// 3rd party dependencies
import { Guild } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import dropGuild from "@helpers/dropGuild";
import logger from "@logger";

import prisma from "@root/database/prisma";

export default {
  name: "guildDelete",
  async execute(guild: Guild) {
    const { client } = guild;

    logger?.verbose(`Deleted from guild: ${guild.name} (${guild.id})`);

    const guildData = await prisma.guild.delete({ where: { id: guild.id } });

    logger.silly(guildData);

    await dropGuild(guild);
    await updatePresence(client);
  },
};
