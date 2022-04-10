import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models

import users from "../../../../helpers/database/models/userSchema";

import creditNoun from "../../../../helpers/creditNoun";
import saveUser from "../../../../helpers/saveUser";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const from = await interaction.options.getUser("from");
  const to = await interaction.options.getUser("to");
  const amount = await interaction.options.getInteger("amount");

  // Get fromUser object
  const fromUser = await users.findOne({
    userId: from?.id,
    guildId: interaction?.guild?.id,
  });

  // Get toUser object
  const toUser = await users.findOne({
    userId: to?.id,
    guildId: interaction?.guild?.id,
  });

  // If fromUser has no credits
  if (!fromUser) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]",
      description:
        "That user has no credits, I can not transfer credits from the user",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // If toUser has no credits
  if (!toUser) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]",
      description:
        "That user has no credits, I can not transfer credits to the user",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  if (amount === null) return;

  // If amount is zero or below
  if (amount <= 0) {
    // Create embed object
    const embed = {
      title: ":toolbox: Admin - Credits [Transfer]",
      description: "You can't transfer zero or below.",
      color: config.colors.error as any,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Withdraw amount from fromUser
  fromUser.credits -= amount;

  // Deposit amount to toUser
  toUser.credits += amount;

  // Save users
  await saveUser(fromUser, toUser)
    // If successful
    .then(async () => {
      // Create embed object
      const embed = {
        title: ":toolbox: Admin - Credits [Transfer]",
        description: `You sent ${creditNoun(amount)} from ${from} to ${to}.`,
        color: config.colors.success as any,
        fields: [
          {
            name: `${from?.username} Balance`,
            value: `${fromUser.credits}`,
            inline: true,
          },
          {
            name: `${to?.username} Balance`,
            value: `${toUser.credits}`,
            inline: true,
          },
        ],
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Send debug message
      await logger.debug(
        `Guild: ${interaction?.guild?.id} User: ${
          interaction?.user?.id
        } transferred ${creditNoun(amount)} from ${from?.id} to ${to?.id}.`
      );
    });
};
