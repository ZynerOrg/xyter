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

  const upsertGuildConfigEmbeds = await prisma.guildConfigEmbeds.upsert({
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

  logger.silly(upsertGuildConfigEmbeds);

  if (!upsertGuildConfigEmbeds) {
    return defaultEmbedConfig;
  }

  return {
    successColor: <ColorResolvable>upsertGuildConfigEmbeds.successColor,
    waitColor: <ColorResolvable>upsertGuildConfigEmbeds.waitColor,
    errorColor: <ColorResolvable>upsertGuildConfigEmbeds.errorColor,
    footerText: upsertGuildConfigEmbeds.footerText,
    footerIcon: upsertGuildConfigEmbeds.footerIcon,
  };
};
