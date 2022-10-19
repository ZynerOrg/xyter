import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import getEmbedConfig from "../../../../../helpers/getEmbedData";
import logger from "../../../../../middlewares/logger";
import guildSchema from "../../../../../models/guild";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("audits")
      .setDescription("Audits")
      .addBooleanOption((option) =>
        option.setName("status").setDescription("Should audits be enabled?")
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel for audit messages.")
          .addChannelTypes(ChannelType.GuildText)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { guild, options } = interaction;
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      guild
    );
    const status = options.getBoolean("status");
    const channel = options.getChannel("channel");

    if (!guild) throw new Error("Guild not found.");
    const guildDB = await guildSchema.findOne({
      guildId: guild.id,
    });
    if (!guildDB) throw new Error("Guild configuration not found.");

    guildDB.audits.status = status !== null ? status : guildDB.audits.status;
    guildDB.audits.channelId = channel ? channel.id : guildDB.audits.channelId;

    await guildDB.save().then(async () => {
      logger.verbose(
        `Guild ${guild.name} updated their configuration for audits.`
      );

      const embedSuccess = new EmbedBuilder()
        .setTitle("[:hammer:] Audits")
        .setDescription("Guild configuration updated successfully.")
        .setColor(successColor)
        .addFields(
          {
            name: "🤖 Status",
            value: `${
              guildDB.audits.status
                ? ":white_check_mark: Enabled"
                : ":x: Disabled"
            }`,
            inline: true,
          },
          {
            name: "🌊 Channel",
            value: `<#${guildDB.audits.channelId}>`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          iconURL: footerIcon,
          text: footerText,
        });

      await interaction.editReply({
        embeds: [embedSuccess],
      });
      return;
    });
  },
};
