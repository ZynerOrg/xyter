import { ChannelType, EmbedBuilder, Message } from "discord.js";
import prisma from "../../handlers/database";
import getEmbedConfig from "../../helpers/getEmbedData";
import logger from "../../middlewares/logger";

export default {
  execute: async (message: Message) => {
    if (message === null) return;

    if (message.guild === null) return;

    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      message.guild
    );

    const getGuild = await prisma.guild.findUnique({
      where: { id: message.guild.id },
    });
    if (!getGuild) throw new Error("Guild not found");

    const { client } = message;

    if (!getGuild) throw new Error("Guild not found");

    if (getGuild.auditsEnabled !== true) return;
    if (!getGuild.auditsChannelId) return;

    const channel = client.channels.cache.get(`${getGuild.auditsChannelId}`);

    if (!channel) return;
    if (channel.type !== ChannelType.GuildText) return;

    channel
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor(successColor)
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL(),
            })
            .setDescription(
              `
            **Message sent by** ${message.author} **deleted in** ${message.channel}
            ${message.content}
            `
            )
            .setTimestamp()
            .setFooter({
              text: footerText,
              iconURL: footerIcon,
            }),
        ],
      })
      .then(() => {
        logger.info(
          `Audit log sent for event messageDelete in guild ${message?.guild?.name} (${message?.guild?.id})`
        );
      })
      .catch(() => {
        throw new Error(
          `Audit log failed to send for event messageDelete in guild ${message?.guild?.name} (${message?.guild?.id})`
        );
      });
  },
};
