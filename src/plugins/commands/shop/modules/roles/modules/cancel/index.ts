// Dependencies
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";

// Models
import shopRolesSchema from "../../../../../../../models/shopRole";

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
      .setName("cancel")
      .setDescription("Cancel a purchase.")
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Role you wish to cancel.")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, guild, user, member } = interaction;

    const optionRole = options.getRole("role");

    if (optionRole === null) {
      logger?.silly(`Role is null.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":dollar: Shop - Roles [Cancel]",
            description: "We could not read your requested role.",
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

    const roleExist = await shopRolesSchema?.findOne({
      guildId: guild?.id,
      userId: user?.id,
      roleId: optionRole?.id,
    });

    if (roleExist === null) return;

    await (member?.roles as GuildMemberRoleManager)?.remove(optionRole?.id);

    await guild?.roles
      .delete(optionRole?.id, `${user?.id} canceled from shop`)
      .then(async () => {
        const userDB = await fetchUser(user, guild);

        if (userDB === null) {
          return logger?.silly(`User is null`);
        }

        await shopRolesSchema?.deleteOne({
          roleId: optionRole?.id,
          userId: user?.id,
          guildId: guild?.id,
        });

        return interaction?.editReply({
          embeds: [
            {
              title: ":shopping_cart: Shop - Roles [Cancel]",
              description: `You have canceled ${optionRole.name}.`,
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
        return logger?.silly(`Role could not be deleted. ${error}`);
      });
  },
};
