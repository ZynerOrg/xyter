const { Permissions } = require('discord.js');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { pterodactyl, credits, points } = require('./addons');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: 'Settings - Guild',
      color: config.colors.error,
      description: 'You do not have permission to manage this!',
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // If subcommand is pterodactyl
  if (interaction.options.getSubcommand() === 'pterodactyl') {
    // Execute pterodactyl addon
    await pterodactyl(interaction);
  }

  // If subcommand is credits
  else if (interaction.options.getSubcommand() === 'credits') {
    // Execute credits addon
    await credits(interaction);
  }

  // If subcommand is points
  else if (interaction.options.getSubcommand() === 'points') {
    // Execute points addon
    await points(interaction);
  }

  // Send debug message
  await logger.debug(
    `Guild: ${member.guild.id} User: ${member.id} executed /${
      interaction.commandName
    } ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}`
  );
};
