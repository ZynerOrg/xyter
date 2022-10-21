/* eslint-disable no-loops/no-loops */
import { ChannelType, EmbedBuilder, Message } from "discord.js";
import prisma from "../../handlers/database";
import getEmbedConfig from "../../helpers/getEmbedData";
import logger from "../../middlewares/logger";

export default {
  execute: async (oldMessage: Message, newMessage: Message) => {
    if (oldMessage === null) return;
    if (newMessage === null) return;

    if (oldMessage.guild === null) return;
    if (newMessage.guild === null) return;

    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      newMessage.guild
    );

    const getGuild = await prisma.guild.findUnique({
      where: { id: oldMessage.guild.id },
    });
    if (!getGuild) throw new Error("Guild not found");

    const { client } = oldMessage;

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
              name: newMessage.author.username,
              iconURL: newMessage.author.displayAvatarURL(),
            })
            .setDescription(
              `
              **Message edited in** ${newMessage.channel} [jump to message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})
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
          `Audit log sent for event messageUpdate in guild ${newMessage?.guild?.name} (${newMessage?.guild?.id})`
        );
      })
      .catch(() => {
        throw new Error(
          `Audit log failed to send for event messageUpdate in guild ${newMessage?.guild?.name} (${newMessage?.guild?.id})`
        );
      });
  },
};
