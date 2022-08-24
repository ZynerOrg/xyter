import { CommandInteraction, Permissions } from "discord.js";

import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import logger from "../../../../../middlewares/logger";

import guildSchema from "../../../../../models/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("shop")
      .setDescription("Shop")
      .addBooleanOption((option) =>
        option
          .setName("roles-status")
          .setDescription("Should roles be enabled?")
      )
      .addNumberOption((option) =>
        option
          .setName("roles-price-per-hour")
          .setDescription("Price per hour for roles.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const rolesStatus = options?.getBoolean("roles-status");
    const rolesPricePerHour = options?.getNumber("roles-price-per-hour");

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild not found in database.`);
    }

    guildDB.shop.roles.status =
      rolesStatus !== null ? rolesStatus : guildDB?.shop?.roles?.status;
    guildDB.shop.roles.pricePerHour =
      rolesPricePerHour !== null
        ? rolesPricePerHour
        : guildDB?.shop?.roles?.pricePerHour;

    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild shop updated.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":hammer: Settings - Guild [Shop]",
            description: `Shop settings updated.`,
            color: successColor,
            fields: [
              {
                name: "🤖 Roles Status",
                value: `${guildDB?.shop?.roles.status}`,
                inline: true,
              },
              {
                name: "🌊 Roles Price Per Hour",
                value: `${guildDB?.shop?.roles.pricePerHour}`,
                inline: true,
              },
            ],
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    });
  },
};
