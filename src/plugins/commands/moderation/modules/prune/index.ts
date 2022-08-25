// Dependencies
import {
  ChannelType,
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  Permissions,
  PermissionsBitField,
} from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: false,
    permissions: [PermissionsBitField.Flags.ManageMessages],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("prune")
      .setDescription("Prune messages!")
      .addIntegerOption((option) =>
        option
          .setName("count")
          .setDescription("How many messages you want to prune.")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option.setName("bots").setDescription("Include bots.")
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);

    const count = interaction.options.getInteger("count");
    if (count == null) return;
    const bots = interaction.options.getBoolean("bots");

    if (count < 1 || count > 100) {
      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:police_car:] Prune")
        .setDescription(`You can only prune between 1 and 100 messages.`)
        .setTimestamp()
        .setColor(errorColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      await interaction.editReply({
        embeds: [interactionEmbed],
      });
      return;
    }

    if (interaction?.channel?.type !== ChannelType.GuildText) return;
    await interaction.channel.messages.fetch().then(async (messages) => {
      const messagesToDelete = (
        bots
          ? messages.filter((m) => m?.interaction?.id !== interaction.id)
          : messages.filter(
              (m) =>
                m?.interaction?.id !== interaction.id && m?.author?.bot !== true
            )
      ).first(count);

      if (interaction?.channel?.type !== ChannelType.GuildText) return;
      await interaction.channel
        .bulkDelete(messagesToDelete, true)
        .then(async () => {
          const interactionEmbed = new EmbedBuilder()
            .setTitle("[:police_car:] Prune")
            .setDescription(`Successfully pruned \`${count}\` messages.`)
            .setTimestamp()
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon });

          await interaction.editReply({
            embeds: [interactionEmbed],
          });
        });
    });
  },
};
