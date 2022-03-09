const { Permissions } = require('discord.js');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { appearance } = require('./addons');

module.exports = async (interaction) => {
  // Destructure member

  const { member } = interaction;

  // Check permission

  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    const embed = {
      title: 'Settings',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Command handler

  if (interaction.options.getSubcommand() === 'appearance') {
    // Execute appearance addon

    await appearance(interaction);
  }

  // Send debug message

  await logger.debug(`Guild: ${member.guild.id} User: ${member.id} executed /${interaction.commandName} ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`);
};
