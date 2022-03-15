const { Permissions } = require('discord.js');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { appearance } = require('./addons');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // If subcommand is appearance
  if (interaction.options.getSubcommand() === 'appearance') {
    // Execute appearance addon
    await appearance(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${member.guild.id} User: ${member.id} executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};
