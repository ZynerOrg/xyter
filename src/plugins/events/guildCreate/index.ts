import { Guild } from "discord.js";
import updatePresence from "../../../helpers/updatePresence";
import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";
import prisma from "../../../prisma";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const { client } = guild;

  await updatePresence(client);

  // Create guildMember object
  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: guild.ownerId,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      user: {
        connectOrCreate: {
          create: {
            id: guild.ownerId,
          },
          where: {
            id: guild.ownerId,
          },
        },
      },
      guild: {
        connectOrCreate: {
          create: {
            id: guild.id,
          },
          where: {
            id: guild.id,
          },
        },
      },
    },
  });

  logger.silly(createGuildMember);
};
