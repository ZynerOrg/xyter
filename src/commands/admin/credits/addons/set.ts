import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models

import users from "../../../../helpers/database/models/userSchema";

import creditNoun from "../../../../helpers/creditNoun";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const user = await interaction.options.getUser("user");
  const amount = await interaction.options.getInteger("amount");

  if (amount === null) return;

  // If amount is zero or below
  if (amount <= 0) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]",
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
    userId: user?.id,
    guildId: interaction?.guild?.id,
  });

  // If toUserDB has no credits
  if (!toUserDB) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Set]",
      description:
        "That user has no credits, I can not set credits to the user",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Set toUserDB with amount
  toUserDB.credits = amount;

  // Save toUserDB
  await toUserDB
    .save()

    // If successful
    .then(async () => {
      // Create embed object
      const embed = {
        title: ":toolbox: Admin - Credits [Set]",
        description: `You set ${creditNoun(amount)} on ${user}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send debug message
      await logger.debug(
        `Administrator: ${interaction.user.username} set ${
          amount <= 1 ? `${amount} credit` : `${amount} credits`
        } on ${user?.username}`
      );

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Send debug message
      await logger.debug(
        `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} set ${
          user?.id
        } to ${creditNoun(amount)}.`
      );
    });
};
