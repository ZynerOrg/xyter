import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models
import users from "../../../../helpers/database/models/userSchema";

import creditNoun from "../../../../helpers/creditNoun";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, user } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const userOption = await interaction.options.getUser("user");
  const amount = await interaction.options.getInteger("amount");

  if (amount === null) return;

  if (amount <= 0) {
    // If amount is zero or below
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]",
      description: "You can't give zero or below.",
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get toUserDB object
  const toUserDB = await users.findOne({
    userId: userOption?.id,
    guildId: interaction?.guild?.id,
  });

  // If toUserDB has no credits
  if (!toUserDB) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Give]",
      description:
        "That userOption has no credits, I can not give credits to the userOption",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Deposit amount to toUserDB
  toUserDB.credits += amount;

  // Save toUserDB
  await toUserDB
    .save()

    // If successful
    .then(async () => {
      // Create embed object
      const embed = {
        title: ":toolbox: Admin - Credits [Give]",
        description: `Gave ${creditNoun(amount)} to ${userOption}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send debug message
      await logger.debug(
        `Administrator: ${interaction.user.username} gave ${
          amount <= 1 ? `${amount} credit` : `${amount} credits`
        } to ${userOption?.username}`
      );

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Send debug message
      await logger.debug(
        `Guild: ${guild?.id} User: ${user?.id} gave ${
          userOption?.id
        } ${creditNoun(amount)}.`
      );
    });
};
