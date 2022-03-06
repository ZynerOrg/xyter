const logger = require(`${__basedir}/handlers/logger`);

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await interaction.deferReply({
        embeds: [
          {
            author: {
              name: interaction.client.user.username,
              icon_url: interaction.client.user.displayAvatarURL(),
              url: 'https://bot.zyner.org/',
            },
            title: 'Check',
            description: 'Please wait...',
            color: __config.colors.wait,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
      await command.execute(interaction);
      await logger.debug(`Executing command: ${interaction.commandName}`);
    }
 catch (err) {
      await logger.error(err);
      await interaction.reply({
        embeds: [
          {
            author: {
              name: interaction.client.user.username,
              icon_url: interaction.client.user.displayAvatarURL(),
              url: 'https://bot.zyner.org/',
            },
            title: 'Error',
            description: 'There was an error while executing this command!',
            color: __config.colors.error,
            timestamp: new Date(),
          },
        ],
        ephemeral: true,
      });
    }
  },
};
