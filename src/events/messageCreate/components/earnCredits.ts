import { ChannelType, Message } from "discord.js";
import prisma from "../../../handlers/prisma";
import cooldown from "../../../middlewares/cooldown";
import economy from "../../../modules/credits";

export default async (message: Message) => {
  const { guild, author, content, channel } = message;

  if (!guild) return;
  if (author.bot) return;
  if (channel.type !== ChannelType.GuildText) return;

  const creditsConfig = await prisma.guildConfigCredits.upsert({
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

  if (content.length < creditsConfig.minimumLength) return;

  await cooldown(
    guild,
    author,
    "event-messageCreate-credits",
    creditsConfig.timeout,
    true
  );

  await economy.give(guild, author, creditsConfig.rate);
};
