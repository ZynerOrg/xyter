import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as embedSuccess } from "../../../../helpers/baseEmbeds";
import checkPermission from "../../../../helpers/checkPermission";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("credits")
    .setDescription(`Configure credits module`)
    .addBooleanOption((option) =>
      option.setName("status").setDescription("Module Status").setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("rate")
        .setDescription("Credits per message")
        .setRequired(true)
        .setMinValue(1)
    )
    .addNumberOption((option) =>
      option
        .setName("minimum-length")
        .setDescription("Minimum length per message")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("work-rate")
        .setDescription("Maximum credits per workshift")
        .setRequired(true)
        .setMinValue(1)
    )
    .addNumberOption((option) =>
      option
        .setName("work-timeout")
        .setDescription("Time between workshifts")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("timeout")
        .setDescription("Time between messages")
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { guild, options } = interaction;

  const status = options.getBoolean("status");
  const rate = options.getNumber("rate");
  const timeout = options.getNumber("timeout");
  const minimumLength = options.getNumber("minimum-length");
  const workRate = options.getNumber("work-rate");
  const workTimeout = options.getNumber("work-timeout");

  if (!guild) throw new Error("Guild not found.");
  if (typeof status !== "boolean") throw new Error("Status must be an boolean");
  if (typeof rate !== "number") throw new Error("Rate must be a number");
  if (typeof workRate !== "number")
    throw new Error("Work rate must be a number");
  if (typeof workTimeout !== "number")
    throw new Error("Work timeout must be a number");
  if (typeof timeout !== "number") throw new Error("Timeout must be a number");
  if (typeof minimumLength !== "number")
    throw new Error("Minimum length must be a number");

  const upsertGuildConfigCredits = await prisma.guildConfigCredits.upsert({
    where: {
      id: guild.id,
    },
    update: {
      status,
      rate,
      timeout,
      workRate,
      workTimeout,
      minimumLength,
    },
    create: {
      id: guild.id,
      status,
      rate,
      timeout,
      workRate,
      workTimeout,
      minimumLength,
    },
  });

  logger.silly(upsertGuildConfigCredits);

  const successEmbed = await embedSuccess(
    guild,
    ":gear:︱Configuration of Credits"
  );

  successEmbed.setDescription("Configuration updated successfully!").addFields(
    {
      name: "Status",
      value: `${upsertGuildConfigCredits.status ? "Enabled" : "Disabled"}`,
      inline: true,
    },
    {
      name: "Rate",
      value: `${upsertGuildConfigCredits.rate}`,
      inline: true,
    },
    {
      name: "Work Rate",
      value: `${upsertGuildConfigCredits.workRate}`,
      inline: true,
    },
    {
      name: "Minimum Length",
      value: `${upsertGuildConfigCredits.minimumLength}`,
      inline: true,
    },
    {
      name: "Timeout",
      value: `${upsertGuildConfigCredits.timeout}`,
      inline: true,
    },
    {
      name: "Work Timeout",
      value: `${upsertGuildConfigCredits.workTimeout}`,
      inline: true,
    }
  );

  await interaction.editReply({
    embeds: [successEmbed],
  });
  return;
};
