import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import prisma from "../../handlers/database";
import getEmbedConfig from "../../helpers/getEmbedData";

export default {
  execute: async (member: GuildMember) => {
    const { footerText, footerIcon, errorColor } = await getEmbedConfig(
      member.guild
    );

    const getGuild = await prisma.guild.findUnique({
      where: { id: member.guild.id },
    });

    if (!getGuild) throw new Error("Guild not found");

    const { client } = member;

    if (getGuild.welcomeEnabled !== true) return;
    if (!getGuild.welcomeLeaveChannelId) return;

    const channel = client.channels.cache.get(
      `${getGuild.welcomeLeaveChannelId}`
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
            getGuild.welcomeLeaveChannelMessage ||
              "Configure a leave message in the `/settings guild welcome`."
          )
          .setTimestamp()
          .setFooter({
            text: footerText,
            iconURL: footerIcon,
          }),
      ],
    });
  },
};
