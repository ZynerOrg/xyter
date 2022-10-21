// 3rd party dependencies
import { Guild } from "discord.js";
import prisma from "../../handlers/database";
import updatePresence from "../../handlers/updatePresence";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  updatePresence(client);

  // Delete guildMember objects
  const deleteGuildMembers = prisma.guildMember.deleteMany({
    where: {
      guildId: guild.id,
    },
  });

  // Delete guild object
  const deleteGuild = prisma.guild.deleteMany({
    where: {
      id: guild.id,
    },
  });

  // The transaction runs synchronously so deleteUsers must run last.
  await prisma.$transaction([deleteGuildMembers, deleteGuild]);

  logger.silly(deleteGuildMembers);
  logger.silly(deleteGuild);
};
