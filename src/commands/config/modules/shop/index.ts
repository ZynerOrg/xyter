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
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
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

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {
        shopRolesEnabled: rolesStatus,
        shopRolesPricePerHour: rolesPricePerHour,
      },
      create: {
        id: guild.id,
        shopRolesEnabled: rolesStatus,
        shopRolesPricePerHour: rolesPricePerHour,
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
          value: `${createGuild.shopRolesEnabled}`,
          inline: true,
        },
        {
          name: "🌊 Roles Price Per Hour",
          value: `${createGuild.shopRolesPricePerHour}`,
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
