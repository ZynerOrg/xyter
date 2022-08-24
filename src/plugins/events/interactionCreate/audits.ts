import logger from "../../../middlewares/logger";
import { Interaction, MessageEmbed, TextChannel } from "discord.js";

import guildSchema from "../../../models/guild";

import getEmbedConfig from "../../../helpers/getEmbedConfig";

export default {
  execute: async (interaction: Interaction) => {
    if (interaction === null) return;

    if (interaction.guild === null) return;

    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      interaction.guild
    );

    const guildData = await guildSchema.findOne({
      guildId: interaction.guild.id,
    });

    const { client } = interaction;

    if (guildData === null) return;

    if (guildData.audits.status !== true) return;
    if (!guildData.audits.channelId) return;

    const channel = client.channels.cache.get(`${guildData.audits.channelId}`);

    if (channel === null) return;

    (channel as TextChannel)
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(successColor)
            .setDescription(
              `
            **Interaction created by** ${interaction.user.username} **in** ${interaction.channel}
            ㅤ**Interaction ID**: ${interaction.id}
            ㅤ**Type**: ${interaction.type}
            ㅤ**User ID**: ${interaction.user.id}
            `
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({
              text: footerText,
              iconURL: footerIcon,
            }),
        ],
      })
      .then(async () => {
        logger.debug(
          `Audit log sent for event interactionCreate in guild ${interaction?.guild?.name} (${interaction?.guild?.id})`
        );
      })
      .catch(async () => {
        logger.error(
          `Audit log failed to send for event interactionCreate in guild ${interaction?.guild?.name} (${interaction?.guild?.id})`
        );
      });
  },
};
