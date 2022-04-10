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

  const name = await interaction.options.getString("name");

  if (name === null) return;

  await interaction?.guild?.roles
    .create({
      name,
      color: "RED",
      reason: `${interaction?.user?.id} bought from shop`,
    })
    .then(async (role) => {
      // Get guild object
      const guildDB = await guilds.findOne({
        guildId: interaction?.guild?.id,
      });
      const userDB = await users.findOne({
        userId: interaction?.user?.id,
        guildId: interaction?.guild?.id,
      });
      const { pricePerHour } = guildDB.shop.roles;

      userDB.credits -= pricePerHour;

      await userDB.save();

      await shopRoles.create({
        roleId: role?.id,
        userId: interaction?.user?.id,
        guildId: interaction?.guild?.id,
        pricePerHour,
        lastPayed: new Date(),
      });

      await (interaction?.member?.roles as GuildMemberRoleManager)?.add(
        role?.id
      );
      await shopRoles.find().then((role: any) => console.log(role));

      const embed = {
        title: ":shopping_cart: Shop - Roles [Buy]",
        description: `You have bought ${role.name} for ${guildDB.shop.roles.pricePerHour} per hour.`,
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
};
