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
    .setName("shop")
    .setDescription("Shop")
    .addBooleanOption((option) =>
      option
        .setName("roles-status")
        .setDescription("Should roles be enabled?")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("roles-price-per-hour")
        .setDescription("Price per hour for roles.")
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

  const rolesStatus = options?.getBoolean("roles-status");
  const rolesPricePerHour = options?.getNumber("roles-price-per-hour");

  if (!guild) throw new Error("Guild not found");
  if (rolesStatus === null) throw new Error("Status must be provided");
  if (!rolesPricePerHour)
    throw new Error("Roles price per hour must be provided");

  const createGuild = await prisma.guildConfigShopRoles.upsert({
    where: {
      id: guild.id,
    },
    update: {
      status: rolesStatus,
      pricePerHour: rolesPricePerHour,
    },
    create: {
      id: guild.id,
      status: rolesStatus,
      pricePerHour: rolesPricePerHour,
    },
  });

  logger.silly(createGuild);

  const interactionEmbed = new EmbedBuilder()
    .setTitle("[:tools:] Shop")
    .setDescription("Shop settings updated")
    .setColor(successColor)
    .addFields(
      {
        name: "🤖 Roles Status",
        value: `${createGuild.status}`,
        inline: true,
      },
      {
        name: "🌊 Roles Price Per Hour",
        value: `${createGuild.pricePerHour}`,
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
