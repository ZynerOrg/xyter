import { EmbedBuilder, Message, TextChannel } from "discord.js";
import getEmbedConfig from "../../../helpers/getEmbedData";
import logger from "../../../middlewares/logger";
import guildSchema from "../../../models/guild";

export default {
  execute: async (message: Message) => {
    if (message === null) return;

    if (message.guild === null) return;

    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      message.guild
    );

    const guildData = await guildSchema.findOne({
      guildId: message.guild.id,
    });

    const { client } = message;

    if (guildData === null) return;

    if (guildData.audits.status !== true) return;
    if (!guildData.audits.channelId) return;

    const channel = client.channels.cache.get(`${guildData.audits.channelId}`);

    if (channel === null) return;

    (channel as TextChannel)
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
      .then(async () => {
        logger.info(
          `Audit log sent for event messageDelete in guild ${message?.guild?.name} (${message?.guild?.id})`
        );
      })
      .catch(async () => {
        logger.error(
          `Audit log failed to send for event messageDelete in guild ${message?.guild?.name} (${message?.guild?.id})`
        );
      });
  },
};
