import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import checkPermission from "../../../../helpers/checkPermission";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("credits")
      .setDescription(`Configure this guild's credits module.`)
      .addBooleanOption((option) =>
        option
          .setName("enabled")
          .setDescription("Do you want to activate the credit module?")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("rate")
          .setDescription("Credit rate per message.")
          .setRequired(true)
          .setMinValue(1)
      )
      .addNumberOption((option) =>
        option
          .setName("minimum-length")
          .setDescription("Minimum message length to receive credit.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("work-rate")
          .setDescription(
            "The maximum amount of credit that can be obtained within a working day."
          )
          .setRequired(true)
          .setMinValue(1)
      )
      .addNumberOption((option) =>
        option
          .setName("work-timeout")
          .setDescription(
            "How long you need to wait before you can work again provided in seconds."
          )
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription(
            "How long you need to wait before you can earn more credits."
          )
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { guild, options } = interaction;

    const enabled = options.getBoolean("enabled");
    const rate = options.getNumber("rate");
    const timeout = options.getNumber("timeout");
    const minimumLength = options.getNumber("minimum-length");
    const workRate = options.getNumber("work-rate");
    const workTimeout = options.getNumber("work-timeout");

    if (!guild) throw new Error("Guild not found.");
    if (typeof enabled !== "boolean")
      throw new Error("Enabled option is not a boolean.");
    if (typeof rate !== "number") throw new Error("Rate is not a number.");
    if (typeof workRate !== "number")
      throw new Error("Work rate is not a number.");
    if (typeof workTimeout !== "number")
      throw new Error("Work timeout is not a number.");
    if (typeof timeout !== "number")
      throw new Error("Timeout is not a number.");
    if (typeof minimumLength !== "number")
      throw new Error("Minimum length is not a number.");

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {
        creditsEnabled: enabled,
        creditsRate: rate,
        creditsTimeout: timeout,
        creditsWorkRate: workRate,
        creditsWorkTimeout: workTimeout,
        creditsMinimumLength: minimumLength,
      },
      create: {
        id: guild.id,
        creditsEnabled: enabled,
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
          name: "🤖 Enabled?",
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

    await interaction.editReply({
      embeds: [interactionEmbed],
    });
    return;
  },
};
