import prisma from "@root/database/prisma";
import { Prisma } from "@prisma/client";
import { Snowflake } from "discord.js";

export default async (guildId: Snowflake, name: string) => {
  const moduleObject = await prisma.module.findUnique({
    where: {
      guildId_name: {
        guildId: guildId,
        name,
      },
    },
  });

  if (!moduleObject) return;

  return {
    guildId: moduleObject.guildId,
    name: moduleObject.name,
    enabled: moduleObject.enabled,
    data: <Prisma.JsonObject>moduleObject.data,
  };
};
