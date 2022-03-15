const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { users } = require('../../../helpers/database/models');
const saveUser = require('../../../helpers/saveUser');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  try {
    // Get options
    const user = await interaction.options.getUser('user');
    const amount = await interaction.options.getInteger('amount');
    const reason = await interaction.options.getString('reason');

    const { member } = interaction;
    const { guild } = member;

    // Get fromUserDB object
    const fromUserDB = await users.findOne({
      userId: interaction.user.id,
      guildId: interaction.member.guild.id,
    });

    // Get toUserDB object
    const toUserDB = await users.findOne({
      userId: user.id,
      guildId: interaction.member.guild.id,
    });

    // If receiver is same as sender
    if (user.id === interaction.user.id) {
      // Create embed object
      const embed = {
        title: ':dollar: Credits - Gift',
        description: "You can't pay yourself.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // If amount is zero or below
    if (amount <= 0) {
      // Create embed object
      const embed = {
        title: ':dollar: Credits - Gift',
        description: "You can't pay zero or below.",
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // If user has below gifting amount
    if (fromUserDB.credits < amount) {
      // Create embed
      const embed = {
        title: ':dollar: Credits - Gift',
        description: `You have insufficient credits. Your credits is ${fromUserDB.credits}`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // If toUserDB has no credits
    if (!toUserDB) {
      // Create embed object
      const embed = {
        title: ':dollar: Credits - Gift',
        description:
          'That user has no credits, I can not gift credits to the user',
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // Withdraw amount from fromUserDB
    fromUserDB.credits -= amount;

    // Deposit amount to toUserDB
    toUserDB.credits += amount;

    // Save users
    await saveUser(fromUserDB, toUserDB).then(async () => {
      // Create interaction embed object
      const interactionEmbed = {
        title: ':dollar: Credits - Gift',
        description: `You sent ${creditNoun(amount)} to ${user}${
          reason ? ` with reason: ${reason}` : ''
        }. Your new credits is ${creditNoun(fromUserDB.credits)}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Create DM embed object
      const dmEmbed = {
        title: ':dollar: Credits - Gift',
        description: `You received ${creditNoun(amount)} from ${
          interaction.user
        }${
          reason ? ` with reason: ${reason}` : ''
        }. Your new credits is ${creditNoun(toUserDB.credits)}.`,
        color: 0x22bb33,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Get DM user object
      const dmUser = await interaction.client.users.cache.get(user.id);

      // Send DM to user
      await dmUser.send({ embeds: [dmEmbed] });

      // Send debug message
      await logger.debug(
        `Guild: ${guild.id} User: ${member.id} gift sent from: ${interaction.user.id} to: ${user.id}`
      );

      // Send interaction reply
      return await interaction.editReply({
        embeds: [interactionEmbed],
        ephemeral: true,
      });
    });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};
