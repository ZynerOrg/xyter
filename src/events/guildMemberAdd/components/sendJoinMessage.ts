import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import prisma from "../../../handlers/prisma";
import getEmbedConfig from "../../../helpers/getEmbedConfig";
import logger from "../../../middlewares/logger";

export default async (member: GuildMember) => {
  const { footerText, footerIcon, successColor } = await getEmbedConfig(
    member.guild
  );

  const getGuildConfigWelcome = await prisma.guildConfigWelcome.findUnique({
    where: { id: member.guild.id },
  });

  if (!getGuildConfigWelcome) {
    logger.verbose("Guild not found");
    return;
  }

  const { client } = member;

  if (getGuildConfigWelcome.status !== true) return;
  if (!getGuildConfigWelcome.joinChannelId) return;

  const channel = client.channels.cache.get(
    `${getGuildConfigWelcome.joinChannelId}`
  );

  if (!channel) throw new Error("Channel not found");
  if (channel.type !== ChannelType.GuildText)
    throw new Error("Channel is not a text channel");

  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(successColor)
        .setTitle(`${member.user.username} has joined the server!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(
          getGuildConfigWelcome.joinChannelMessage ||
            "Configure a join message in the `/settings guild welcome`."
        )
        .setTimestamp()
        .setFooter({
          text: footerText,
          iconURL: footerIcon,
        }),
    ],
  });
};
