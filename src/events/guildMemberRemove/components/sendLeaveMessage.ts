import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import prisma from "../../../handlers/prisma";
import getEmbedConfig from "../../../helpers/getEmbedConfig";

export default async (member: GuildMember) => {
  const { footerText, footerIcon, errorColor } = await getEmbedConfig(
    member.guild
  );

  const getGuildConfigWelcome = await prisma.guildConfigWelcome.findUnique({
    where: { id: member.guild.id },
  });

  if (!getGuildConfigWelcome) throw new Error("Guild not found");

  const { client } = member;

  if (getGuildConfigWelcome.status !== true) return;
  if (!getGuildConfigWelcome.leaveChannelId) return;

  const channel = client.channels.cache.get(
    `${getGuildConfigWelcome.leaveChannelId}`
  );

  if (!channel) throw new Error("Channel not found");
  if (channel.type !== ChannelType.GuildText)
    throw new Error("Channel is not a text channel");

  channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(errorColor)
        .setTitle(`${member.user.username} has left the server!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(
          getGuildConfigWelcome.leaveChannelMessage ||
            "Configure a leave message in the `/settings guild welcome`."
        )
        .setTimestamp()
        .setFooter({
          text: footerText,
          iconURL: footerIcon,
        }),
    ],
  });
};
