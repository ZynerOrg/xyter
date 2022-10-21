import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import prisma from "../../handlers/database";
import getEmbedConfig from "../../helpers/getEmbedData";
import logger from "../../middlewares/logger";

export default {
  execute: async (member: GuildMember) => {
    const { client, guild } = member;

    const getGuild = await prisma.guild.findUnique({
      where: { id: member.guild.id },
    });
    if (!getGuild) throw new Error("Guild not found");

    if (getGuild.auditsEnabled !== true) return;
    if (!getGuild.auditsChannelId) {
      throw new Error("Channel not found");
    }

    const embedConfig = await getEmbedConfig(guild);

    const channel = client.channels.cache.get(getGuild.auditsChannelId);

    if (!channel) throw new Error("Channel not found");
    if (channel.type !== ChannelType.GuildText) {
      throw new Error("Channel must be a text channel");
    }

    const embed = new EmbedBuilder()
      .setTimestamp(new Date())
      .setAuthor({
        name: "Member Joined",
        iconURL: client.user?.displayAvatarURL(),
      })
      .setFooter({
        text: embedConfig.footerText,
        iconURL: embedConfig.footerIcon,
      });

    await channel
      .send({
        embeds: [
          embed
            .setColor(embedConfig.successColor)
            .setDescription(`${member.user} - (${member.user.tag})`)
            .addFields([
              {
                name: "Account Age",
                value: `${member.user.createdAt}`,
              },
            ]),
        ],
      })
      .then(() => {
        logger.debug(`Audit log sent for event guildMemberAdd`);
      })
      .catch(() => {
        throw new Error("Audit log failed to send");
      });
  },
};
