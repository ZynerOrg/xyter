// Dependencies
import {
  CommandInteraction,
  ColorResolvable,
  GuildMemberRoleManager,
} from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";

// Models
import shopRolesSchema from "../../../../../../../models/shopRole";
import guildSchema from "../../../../../../../models/guild";

import logger from "../../../../../../../middlewares/logger";

// Helpers
import pluralize from "../../../../../../../helpers/pluralize";
import fetchUser from "../../../../../../../helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("buy")
      .setDescription("Buy a custom role.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("Name of the role you wish to buy.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("color")
          .setDescription("Color of the role you wish to buy.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, guild, user, member } = interaction;

    const optionName = options?.getString("name");
    const optionColor = options?.getString("color");

    // If amount is null
    if (optionName === null) {
      logger?.silly(`Name is null.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":dollar: Shop - Roles [Buy]",
            description: "We could not read your requested name.",
            color: errorColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    }

    await guild?.roles
      .create({
        name: optionName,
        color: optionColor as ColorResolvable,
        reason: `${user?.id} bought from shop`,
      })
      .then(async (role) => {
        // Get guild object
        const guildDB = await guildSchema?.findOne({
          guildId: guild?.id,
        });

        const userDB = await fetchUser(user, guild);

        if (userDB === null) {
          return logger?.silly(`User is null`);
        }

        if (guildDB === null) {
          return logger?.silly(`Guild is null`);
        }

        if (guildDB.shop === null) {
          return logger?.silly(`Shop is null`);
        }

        const { pricePerHour } = guildDB.shop.roles;

        userDB.credits -= pricePerHour;

        await userDB?.save();

        await shopRolesSchema?.create({
          roleId: role?.id,
          userId: user?.id,
          guildId: guild?.id,
          pricePerHour,
          lastPayed: new Date(),
        });

        await (member?.roles as GuildMemberRoleManager)?.add(role?.id);

        logger?.silly(`Role ${role?.name} was bought by ${user?.tag}`);

        return interaction?.editReply({
          embeds: [
            {
              title: ":shopping_cart: Shop - Roles [Buy]",
              description: `You bought **${optionName}** for **${pluralize(
                pricePerHour,
                "credit"
              )}**.`,
              color: successColor,
              fields: [
                {
                  name: "Your balance",
                  value: `${pluralize(userDB?.credits, "credit")}`,
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
      })
      .catch(async (error) => {
        return logger?.silly(`Role could not be created. ${error}`);
      });
  },
};
