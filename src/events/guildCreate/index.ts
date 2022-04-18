// 3rd party dependencies
import { Guild } from "discord.js";

// Dependencies
import updatePresence from "@helpers/updatePresence";
import logger from "@logger";

import prisma from "@root/database/prisma";

export default {
  name: "guildCreate",
  async execute(guild: Guild) {
    const { client } = guild;

    logger?.verbose(`Added to guild: ${guild.name} (${guild.id})`);

    const guildData = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {},
      create: {
        id: guild.id,
      },
    });

    logger.silly(guildData);

    await updatePresence(client);
  },
};
