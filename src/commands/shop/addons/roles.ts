import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import guilds from "../../../helpers/database/models/guildSchema";
import users from "../../../helpers/database/models/userSchema";
import creditNoun from "../../../helpers/creditNoun";
import { CommandInteraction, RoleManager } from "discord.js";
export default async (interaction: CommandInteraction) => {
  const name = interaction.options.getString("name");

  const { member } = interaction;

  const guildDB = await guilds.findOne({ guildId: interaction?.guild?.id });
  const userDB = await users.findOne({
    userId: interaction?.user?.id,
    guildId: interaction?.guild?.id,
  });

  if (name === null) return;

  (interaction?.guild?.roles as RoleManager)
    .create({
      name,
      color: "BLUE",
      reason: `${interaction?.user?.id} bought from shop`,
    })
    .then(async (role) => {
      console.log(role);
      userDB.credits -= guildDB.shop.roles.pricePerHour;
      await userDB.save().then(async () => {
        const embed = {
          title: ":shopping_cart: Shop - Roles",
          description: `You have bought ${role.name} for ${guildDB.shop.roles.pricePerHour} per hour.`,
          color: config.colors.error as any,
          fields: [
            { name: "Your balance", value: `${creditNoun(userDB.credits)}` },
          ],
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        return interaction.editReply({
          embeds: [embed],
        });
      });
    })
    .catch(console.error);
};
