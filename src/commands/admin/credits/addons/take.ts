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
      title: ":toolbox: Admin - Credits [Take]",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const userOption = await interaction.options.getUser("userOption");
  const amount = await interaction.options.getInteger("amount");

  if (amount === null) return;

  // If amount is zero or below
  if (amount <= 0) {
    // Give embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Take]",
      description: "You can't take zero or below.",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get toUser object
  const toUser = await users.findOne({
    userId: userOption?.id,
    guildId: interaction?.guild?.id,
  });

  // If toUser has no credits
  if (!toUser) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Take]",
      description:
        "That userOption has no credits, I can not take credits from the userOption",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Withdraw amount from toUser
  toUser.credits -= amount;

  // Save toUser
  await toUser
    .save()

    // If successful
    .then(async () => {
      // Create embed object
      const embed = {
        title: ":toolbox: Admin - Credits [Take]",
        description: `You took ${creditNoun(amount)} to ${userOption}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send debug message
      await logger.debug(
        `Administrator: ${interaction.user.username} took ${
          amount <= 1 ? `${amount} credit` : `${amount} credits`
        } from ${userOption?.username}`
      );

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Send debug message
      await logger.debug(
        `Guild: ${guild?.id} User: ${user?.id} took ${creditNoun(
          amount
        )} from ${user.id}.`
      );
    });
};
