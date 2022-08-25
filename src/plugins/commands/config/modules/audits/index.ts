import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";

import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import logger from "../../../../../middlewares/logger";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
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
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const { guild, options } = interaction;

    const status = options?.getBoolean("status");
    const channel = options?.getChannel("channel");

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild not found in database.`);
    }

    guildDB.audits.status = status !== null ? status : guildDB?.audits?.status;
    guildDB.audits.channelId =
      channel !== null ? channel.id : guildDB?.audits?.channelId;

    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild audits updated.`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:hammer:] Audits")
        .setDescription("Audit settings updated!")
        .setColor(successColor)
        .addFields(
          {
            name: "🤖 Status",
            value: `${guildDB?.audits?.status}`,
            inline: true,
          },
          {
            name: "🌊 Channel",
            value: `${guildDB?.audits?.channelId}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          iconURL: footerIcon,
          text: footerText,
        });

      return interaction?.editReply({
        embeds: [interactionEmbed],
      });
    });
  },
};
