import { ChannelType, EmbedBuilder, Guild } from "discord.js";
import prisma from "../../handlers/database";
import getEmbedConfig from "../../helpers/getEmbedData";
import logger from "../../middlewares/logger";

export default async (guild: Guild, embed: EmbedBuilder) => {
  const getGuild = await prisma.guild.findUnique({
    where: { id: guild.id },
  });
  if (!getGuild) throw new Error("Guild not found");

  if (getGuild.auditsEnabled !== true) return;
  if (!getGuild.auditsChannelId) {
    throw new Error("Channel not found");
  }

  const embedConfig = await getEmbedConfig(guild);

  embed
    .setTimestamp(new Date())
    .setFooter({
      text: embedConfig.footerText,
      iconURL: embedConfig.footerIcon,
    })
    .setColor(embedConfig.successColor);

  const channel = guild.client.channels.cache.get(getGuild.auditsChannelId);

  if (!channel) throw new Error("Channel not found");
  if (channel.type !== ChannelType.GuildText) {
    throw new Error("Channel must be a text channel");
  }

  await channel
    .send({
      embeds: [embed],
    })
    .then(() => {
      logger.debug(`Audit log sent for event guildMemberAdd`);
    })
    .catch(() => {
      throw new Error("Audit log failed to send");
    });
};
