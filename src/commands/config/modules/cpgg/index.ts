import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import checkPermission from "../../../../helpers/checkPermission";
import encryption from "../../../../helpers/encryption";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("cpgg")
      .setDescription("Controlpanel.gg")
      .addStringOption((option) =>
        option
          .setName("scheme")
          .setDescription(`Controlpanel.gg Scheme`)
          .setRequired(true)
          .setChoices(
            { name: "HTTPS (secure)", value: "https" },
            { name: "HTTP (insecure)", value: "http" }
          )
      )
      .addStringOption((option) =>
        option
          .setName("domain")
          .setDescription(`Controlpanel.gg Domain`)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("token")
          .setDescription(`Controlpanel.gg Application API`)
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const tokenData = options.getString("token");
    const scheme = options.getString("scheme");
    const domain = options.getString("domain");
    const token = tokenData && encryption.encrypt(tokenData);
    const url = scheme && domain && encryption.encrypt(`${scheme}://${domain}`);

    if (!guild) throw new Error("No guild found");
    if (!token) throw new Error("Token not found");
    if (!url) throw new Error("URL not found");

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {
        apiCpggTokenIv: token.iv,
        apiCpggTokenContent: token.content,
        apiCpggUrlIv: url.iv,
        apiCpggUrlContent: url.content,
      },
      create: {
        id: guild.id,
        apiCpggTokenIv: token.iv,
        apiCpggTokenContent: token.content,
        apiCpggUrlIv: url.iv,
        apiCpggUrlContent: url.content,
      },
    });

    logger.silly(createGuild);

    logger?.silly(`Updated API credentials.`);

    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:tools:] CPGG")
      .setDescription(
        `The following configuration will be used.

**Scheme**: ${scheme}
**Domain**: ${domain}
**Token**: ends with ${tokenData?.slice(-4)}`
      )
      .setColor(successColor)
      .setTimestamp()
      .setFooter({
        iconURL: footerIcon,
        text: footerText,
      });

    await interaction?.editReply({
      embeds: [interactionEmbed],
    });
    return;
  },
};
