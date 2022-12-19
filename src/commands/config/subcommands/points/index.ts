import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import checkPermission from "../../../../helpers/checkPermission";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
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
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

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

  const createGuild = await prisma.guildConfigPoints.upsert({
    where: {
      id: guild.id,
    },
    update: {
      status: status,
      rate: rate,
      timeout: timeout,
      minimumLength: minimumLength,
    },
    create: {
      id: guild.id,
      status: status,
      rate: rate,
      timeout: timeout,
      minimumLength: minimumLength,
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
        value: `${createGuild.status}`,
        inline: true,
      },
      {
        name: "📈 Rate",
        value: `${createGuild.rate}`,
        inline: true,
      },
      {
        name: "🔨 Minimum Length",
        value: `${createGuild.minimumLength}`,
        inline: true,
      },
      {
        name: "⏰ Timeout",
        value: `${createGuild.timeout}`,
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
};
