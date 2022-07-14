// Dependencies
import { CommandInteraction, Permissions } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: false,
    permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
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
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const count = interaction.options.getInteger("count");
    if (count == null) return;
    const bots = interaction.options.getBoolean("bots");

    if (count < 1 || count > 100) {
      const interactionEmbed = {
        title: "[:police_car:] Prune",
        description: `You can only prune between 1 and 100 messages.`,
        color: successColor,
        timestamp: new Date(),
        footer: {
          iconURL: footerIcon,
          text: footerText,
        },
      };
      await interaction.editReply({
        embeds: [interactionEmbed],
      });
      return;
    }

    if (interaction?.channel?.type !== "GUILD_TEXT") return;
    await interaction.channel.messages.fetch().then(async (messages) => {
      const messagesToDelete = (
        bots
          ? messages.filter((m) => m?.interaction?.id !== interaction.id)
          : messages.filter(
              (m) =>
                m?.interaction?.id !== interaction.id && m?.author?.bot !== true
            )
      ).first(count);

      if (interaction?.channel?.type !== "GUILD_TEXT") return;
      await interaction.channel
        .bulkDelete(messagesToDelete, true)
        .then(async () => {
          const interactionEmbed = {
            title: "[:police_car:] Prune",
            description: `Successfully pruned \`${count}\` messages.`,
            color: successColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          };
          await interaction.editReply({
            embeds: [interactionEmbed],
          });
        });
    });
  },
};
