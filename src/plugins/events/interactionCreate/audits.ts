import { BaseInteraction, EmbedBuilder, TextChannel } from "discord.js";
import getEmbedConfig from "../../../helpers/getEmbedData";
import logger from "../../../middlewares/logger";
import guildSchema from "../../../models/guild";

export default {
  execute: async (interaction: BaseInteraction) => {
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
          new EmbedBuilder()
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
