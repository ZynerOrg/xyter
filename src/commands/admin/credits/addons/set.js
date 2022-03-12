const { Permissions } = require('discord.js');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

// Database models

const { credits } = require('../../../../helpers/database/models');
const creditNoun = require('../../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Destructure member

  const { member } = interaction;

  // Check permission

  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    const embed = {
      title: 'Admin',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get options

  const user = await interaction.options.getUser('user');
  const amount = await interaction.options.getInteger('amount');

  // Stop if given amount is zero or below

  if (amount <= 0) {
    const embed = {
      title: 'Give',
      description: "You can't give zero or below.",
      color: 0xbb2124,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Get toUser object

  const toUser = await credits.findOne({
    userId: user.id,
    guildId: interaction.member.guild.id,
  });

  // Stop if user has zero or below credits

  if (!toUser) {
    const embed = {
      title: 'Set',
      description:
        'That user has no credits, I can not set credits to the user',
      color: config.colors.error,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Set toUser with amount

  toUser.balance = amount;

  // Save toUser

  await toUser.save().then(async () => {
    const embed = {
      title: 'Set',
      description: `You set ${creditNoun(amount)} on ${user}.`,
      color: 0x22bb33,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    await logger.debug(
      `Administrator: ${interaction.user.username} set ${
        amount <= 1 ? `${amount} credit` : `${amount} credits`
      } on ${user.username}`
    );
    // Send reply

    await interaction.editReply({ embeds: [embed], ephemeral: true });

    // Send debug message

    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} set ${
        user.id
      } to ${creditNoun(amount)}.`
    );
  });
};
