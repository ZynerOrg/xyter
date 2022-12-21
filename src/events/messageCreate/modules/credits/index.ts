import { ChannelType, Message } from "discord.js";
import prisma from "../../../../handlers/database";
import creditsGive from "../../../../helpers/credits/give";
import cooldown from "../../../../middlewares/cooldown";
import logger from "../../../../middlewares/logger";

export default async (message: Message) => {
  const { guild, author, content, channel } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel.type !== ChannelType.GuildText) return;

  const upsertGuildConfigCredits = await prisma.guildConfigCredits.upsert({
    where: {
      id: guild.id,
    },
    update: {},
    create: {
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
    include: {
      guild: true,
    },
  });

  logger.silly(upsertGuildConfigCredits);

  if (content.length < upsertGuildConfigCredits.minimumLength) return;

  await cooldown(
    guild,
    author,
    "event-messageCreate-credits",
    upsertGuildConfigCredits.timeout,
    true
  );

  await creditsGive(guild, author, upsertGuildConfigCredits.rate);
};
