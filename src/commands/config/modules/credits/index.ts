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
      .setName("credits")
      .setDescription(`Credits`)
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
          .setName("work-rate")
          .setDescription("Maximum amount of credits on work.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("work-timeout")
          .setDescription("Timeout between work schedules (seconds).")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription("Timeout between earning credits (seconds).")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { guild, options } = interaction;

    const status = options?.getBoolean("status");
    const rate = options?.getNumber("rate");
    const timeout = options?.getNumber("timeout");
    const minimumLength = options?.getNumber("minimum-length");
    const workRate = options?.getNumber("work-rate");
    const workTimeout = options?.getNumber("work-timeout");

    if (!guild) throw new Error("Guild is not found");
    if (status === null) throw new Error("Status is null");
    if (!rate) throw new Error("Rate is null");
    if (!workRate) throw new Error("WorkRate is null");
    if (!workTimeout) throw new Error("WorkTimeout is null");
    if (!timeout) throw new Error("Timeout is null");
    if (!minimumLength) throw new Error("Minimum Length is null");

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {
        creditsEnabled: status,
        creditsRate: rate,
        creditsTimeout: timeout,
        creditsWorkRate: workRate,
        creditsWorkTimeout: workTimeout,
        creditsMinimumLength: minimumLength,
      },
      create: {
        id: guild.id,
        creditsEnabled: status,
        creditsRate: rate,
        creditsTimeout: timeout,
        creditsWorkRate: workRate,
        creditsWorkTimeout: workTimeout,
        creditsMinimumLength: minimumLength,
      },
    });

    logger.silly(createGuild);

    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:tools:] Credits")
      .setDescription("Credits settings updated")
      .setColor(successColor)
      .addFields(
        {
          name: "🤖 Status",
          value: `${createGuild.creditsEnabled}`,
          inline: true,
        },
        {
          name: "📈 Rate",
          value: `${createGuild.creditsRate}`,
          inline: true,
        },
        {
          name: "📈 Work Rate",
          value: `${createGuild.creditsWorkRate}`,
          inline: true,
        },
        {
          name: "🔨 Minimum Length",
          value: `${createGuild.creditsMinimumLength}`,
          inline: true,
        },
        {
          name: "⏰ Timeout",
          value: `${createGuild.creditsTimeout}`,
          inline: true,
        },
        {
          name: "⏰ Work Timeout",
          value: `${createGuild.creditsWorkTimeout}`,
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
