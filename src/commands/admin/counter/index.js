const { Permissions } = require('discord.js');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { add, remove } = require('./addons');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ':toolbox: Admin - Counter',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // If subcommand is give
  if (interaction.options.getSubcommand() === 'add') {
    // Execute give addon
    await add(interaction);
  }

  // If subcommand is take
  else if (interaction.options.getSubcommand() === 'remove') {
    // Execute take addon
    await remove(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${member.guild.id} User: ${member.id} executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};
