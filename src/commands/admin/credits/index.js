const { Permissions } = require('discord.js');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const {
  give, take, set, transfer,
} = require('./addons');

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
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Command handler

  if (interaction.options.getSubcommand() === 'give') {
    // Execute give addon

    await give(interaction);
  } else if (interaction.options.getSubcommand() === 'take') {
    // Execute take addon

    await take(interaction);
  } else if (interaction.options.getSubcommand() === 'set') {
    // Execute set addon

    await set(interaction);
  } else if (interaction.options.getSubcommand() === 'transfer') {
    // Execute transfer addon

    await transfer(interaction);
  }

  // Send debug message

  await logger.debug(`Guild: ${member.guild.id} User: ${member.id} executed /${interaction.commandName} ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`);
};
