import { ColorResolvable, Guild } from "discord.js";
import prisma from "../../handlers/database";
import logger from "../../middlewares/logger";

export default async (guild?: Guild | null) => {
  const {
    EMBED_COLOR_SUCCESS,
    EMBED_COLOR_WAIT,
    EMBED_COLOR_ERROR,
    EMBED_FOOTER_TEXT,
    EMBED_FOOTER_ICON,
  } = process.env;

  const defaultEmbedConfig = {
    successColor: EMBED_COLOR_SUCCESS,
    waitColor: EMBED_COLOR_WAIT,
    errorColor: EMBED_COLOR_ERROR,
    footerText: EMBED_FOOTER_TEXT,
    footerIcon: EMBED_FOOTER_ICON,
  };

  if (!guild) {
    return defaultEmbedConfig;
  }

  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: guild?.ownerId,
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
    include: {
      user: true,
      guild: true,
    },
  });

  logger.silly(createGuildMember);

  if (!createGuildMember) {
    return defaultEmbedConfig;
  }

  return {
    successColor: <ColorResolvable>createGuildMember.guild.embedColorSuccess,
    waitColor: <ColorResolvable>createGuildMember.guild.embedColorWait,
    errorColor: <ColorResolvable>createGuildMember.guild.embedColorError,
    footerText: createGuildMember.guild.embedFooterText,
    footerIcon: createGuildMember.guild.embedFooterIcon,
  };
};
