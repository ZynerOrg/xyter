import { Guild } from "discord.js";
import prisma from "../../handlers/prisma";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  const guildId = guild.id; // Assuming guild.id is the unique ID of the guild

  try {
    // Delete the Guild model
    await prisma.guild.deleteMany({
      where: {
        id: guildId,
      },
    });

    logger.info(`Deleted guild and related records with ID: ${guildId}`);
  } catch (error) {
    logger.error(`Error executing guild deletion: ${error}`);
    // Handle the error appropriately (e.g., logging, sending an error message, etc.)
  }
};
