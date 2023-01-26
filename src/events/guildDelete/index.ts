// 3rd party dependencies
import { Guild } from "discord.js";
import prisma from "../../handlers/prisma";
import { IEventOptions } from "../../interfaces/EventOptions";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (guild: Guild) => {
  return await prisma.$transaction(async (tx) => {
    tx.guildMember.deleteMany({
      where: {
        guildId: guild.id,
      },
    });
    tx.guild.deleteMany({
      where: {
        id: guild.id,
      },
    });
  });
};
