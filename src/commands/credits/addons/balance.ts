import { CommandInteraction } from "discord.js";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import users from "../../../helpers/database/models/userSchema";
import creditNoun from "../../../helpers/creditNoun";

export default async (interaction: CommandInteraction) => {
  // Get options
  const user = await interaction.options.getUser("user");

  // Get credit object
  const userDB = await users.findOne({
    userId: user ? user.id : interaction?.user?.id,
    guildId: interaction?.guild?.id,
  });

  // Destructure balance
  const { credits } = userDB;

  // If !userDB
  if (!userDB) {
    // Create embed object
    const embed = {
      title: ":dollar: Credits - Balance",
      description: `${
        user ? `${user} is` : "You are"
      } not found in the database.`,
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // If !credits
  if (!credits) {
    // Create embed object
    const embed = {
      title: ":dollar: Credits - Balance",
      description: `${user ? `${user} has` : "You have"} no credits.`,
      color: config.colors.success as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // If credits
  if (credits) {
    // Create embed object
    const embed = {
      title: ":dollar: Credits - Balance",
      description: `${user ? `${user} has` : "You have"} ${creditNoun(
        credits
      )}.`,
      color: config.colors.success as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }
};
