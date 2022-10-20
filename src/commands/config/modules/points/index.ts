import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import prisma from "../../../../handlers/database";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("points")
      .setDescription("Points")
      .addBooleanOption((option) =>
        option
          .setName("status")
          .setDescription("Should credits be enabled?")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("rate")
          .setDescription("Amount of credits per message.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("minimum-length")
          .setDescription("Minimum length of message to earn credits.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription("Timeout between earning credits (milliseconds).")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const { options, guild } = interaction;

    const status = options?.getBoolean("status");
    const rate = options?.getNumber("rate");
    const timeout = options?.getNumber("timeout");
    const minimumLength = options?.getNumber("minimum-length");

    if (!guild) throw new Error("Guild is required");
    if (status === null) throw new Error("Status must be specified");
    if (!rate) throw new Error("Rate must be specified");
    if (!timeout) throw new Error("Timeout must be specified");
    if (!minimumLength) throw new Error("Minimum length must be specified");

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {
        pointsEnabled: status,
        pointsRate: rate,
        pointsTimeout: timeout,
        pointsMinimumLength: minimumLength,
      },
      create: {
        id: guild.id,
        pointsEnabled: status,
        pointsRate: rate,
        pointsTimeout: timeout,
        pointsMinimumLength: minimumLength,
      },
    });

    logger.silly(createGuild);

    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:tools:] Points")
      .setDescription("Points settings updated")
      .setColor(successColor)
      .addFields(
        {
          name: "🤖 Status",
          value: `${createGuild.pointsEnabled}`,
          inline: true,
        },
        {
          name: "📈 Rate",
          value: `${createGuild.pointsRate}`,
          inline: true,
        },
        {
          name: "🔨 Minimum Length",
          value: `${createGuild.pointsMinimumLength}`,
          inline: true,
        },
        {
          name: "⏰ Timeout",
          value: `${createGuild.pointsTimeout}`,
          inline: true,
        }
      )
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
