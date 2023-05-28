import { Prisma } from "@prisma/client";
import { Guild } from "discord.js";
import prisma from "../handlers/prisma";

export const upsertApiCredentials = async (
  guild: Guild,
  apiName: string,
  credentials:
    | Prisma.NullTypes.JsonNull
    | Prisma.InputJsonValue
    | Prisma.JsonObject
    | Prisma.InputJsonObject
) => {
  await prisma.apiCredentials.upsert({
    where: {
      guildId_apiName: { guildId: guild.id, apiName },
    },
    create: {
      guildId: guild.id,
      apiName,
      credentials,
    },
    update: {
      credentials,
    },
  });
};
