const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models

const { users } = require('../../../../helpers/database/models');
const creditNoun = require('../../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ':toolbox: Admin - Credits [Take]',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options
  const user = await interaction.options.getUser('user');
  const amount = await interaction.options.getInteger('amount');

  // If amount is zero or below
  if (amount <= 0) {
    // Give embed object
    const embed = {
      title: ':toolbox: Admin - Credits [Take]',
      description: "You can't take zero or below.",
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get toUser object
  const toUser = await users.findOne({
    userId: user.id,
    guildId: interaction.member.guild.id,
  });

  // If toUser has no credits
  if (!toUser) {
    // Create embed object
    const embed = {
      title: ':toolbox: Admin - Credits [Take]',
      description:
        'That user has no credits, I can not take credits from the user',
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed], ephemeral: true });
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
        title: ':toolbox: Admin - Credits [Take]',
        description: `You took ${creditNoun(amount)} to ${user}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send debug message
      await logger.debug(
        `Administrator: ${interaction.user.username} took ${
          amount <= 1 ? `${amount} credit` : `${amount} credits`
        } from ${user.username}`
      );

      // Send interaction reply
      await interaction.editReply({ embeds: [embed], ephemeral: true });

      // Send debug message
      await logger.debug(
        `Guild: ${member.guild.id} User: ${member.id} took ${creditNoun(
          amount
        )} from ${user.id}.`
      );
    });
};
