import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";
import users from "../../../../helpers/database/models/userSchema";
import shopRoles from "../../../../helpers/database/models/shopRolesSchema";
import guilds from "../../../../helpers/database/models/guildSchema";
import creditNoun from "../../../../helpers/creditNoun";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
export default async (interaction: CommandInteraction) => {
  const { member } = interaction;

  const role = await interaction.options.getRole("role");

  if (role === null) return;

  const roleExist = await shopRoles.find({
    guildId: interaction?.guild?.id,
    userId: interaction?.user?.id,
    roleId: role?.id,
  });

  if (roleExist) {
    await (interaction?.member?.roles as GuildMemberRoleManager).remove(
      role?.id
    );

    await interaction?.guild?.roles
      .delete(role?.id, `${interaction?.user?.id} canceled from shop`)
      .then(async () => {
        // Get guild object
        const guildDB = await guilds.findOne({
          guildId: interaction?.guild?.id,
        });

        const userDB = await users.findOne({
          userId: interaction?.user?.id,
          guildId: interaction?.guild?.id,
        });

        await shopRoles.deleteOne({
          roleId: role?.id,
          userId: interaction?.user?.id,
          guildId: interaction?.guild?.id,
        });

        const embed = {
          title: ":shopping_cart: Shop - Roles [Buy]",
          description: `You have canceled ${role.name}.`,
          color: config.colors.success as any,
          fields: [
            { name: "Your balance", value: `${creditNoun(userDB.credits)}` },
          ],
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        return interaction.editReply({
          embeds: [embed],
        });
      })
      .catch(console.error);
  }
};
