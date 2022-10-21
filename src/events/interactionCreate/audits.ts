import { BaseInteraction, ChannelType, EmbedBuilder } from "discord.js";
import prisma from "../../handlers/database";
import getEmbedConfig from "../../helpers/getEmbedData";
import logger from "../../middlewares/logger";

export default {
  execute: async (interaction: BaseInteraction) => {
    if (interaction === null) return;

    if (interaction.guild === null) return;

    const getGuild = await prisma.guild.findUnique({
      where: { id: interaction.guild.id },
    });
    if (!getGuild) throw new Error("Guild not found");

    const { footerText, footerIcon, successColor } = await getEmbedConfig(
      interaction.guild
    );

    const { client } = interaction;

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
      .then(() => {
        logger.debug(
          `Audit log sent for event interactionCreate in guild ${interaction?.guild?.name} (${interaction?.guild?.id})`
        );
      })
      .catch(() => {
        logger.silly("Failed to send audit log for event interactionCreate");
      });
  },
};
