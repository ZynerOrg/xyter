import { Guild, User } from "discord.js";
import db from "../handlers/prisma";

export default async (guild: Guild, user: User) => {
  return await db.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: user.id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      user: {
        connectOrCreate: {
          create: {
            id: user.id,
          },
          where: {
            id: user.id,
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
};
