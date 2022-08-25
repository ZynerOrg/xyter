import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

import guildSchema from "../../../models/guild";

import getEmbedConfig from "../../../helpers/getEmbedConfig";

export default {
  execute: async (member: GuildMember) => {
    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      member.guild
    );

    const guildData = await guildSchema.findOne({ guildId: member.guild.id });

    const { client } = member;

    if (guildData === null) return;

    if (guildData.welcome.status !== true) return;
    if (!guildData.welcome.joinChannel) return;

    const channel = client.channels.cache.get(
      `${guildData.welcome.joinChannel}`
    );

    if (channel === null) return;

    (channel as TextChannel).send({
      embeds: [
        new EmbedBuilder()
          .setColor(successColor)
          .setTitle(`${member.user.username} has joined the server!`)
          .setThumbnail(member.user.displayAvatarURL())
          .setDescription(
            guildData.welcome.joinChannelMessage ||
              "Configure a join message in the `/settings guild welcome`."
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
