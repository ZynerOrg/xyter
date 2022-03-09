const config = require('../../config.json');
const logger = require('../handlers/logger');

const guilds = require('../helpers/database/models/guildSchema');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      const guildExist = await guilds.findOne({ guildId: interaction.member.guild.id });

      if (!guildExist) {
        await guilds.create({ guildId: interaction.member.guild.id });
      }

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
              color: config.colors.wait,
              timestamp: new Date(),
            },
          ],
          ephemeral: true,
        });
        await command.execute(interaction);
        await logger.debug(`Executing command: ${interaction.commandName}`);
      } catch (err) {
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
              color: config.colors.error,
              timestamp: new Date(),
            },
          ],
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);

      try {
        if (!button) {
          await interaction.deferReply();
          await interaction.editReply({ content: `Button not exist: ${interaction.customId}` });
        }

        await button.execute(interaction);
        await logger.debug(`Button pressed: ${interaction.customId}`);
      } catch (err) {
        await logger.error(err);
      }
    } else if (interaction.isSelectMenu()) {
      const menu = interaction.client.menus.get(interaction.customId);

      try {
        if (!menu) {
          await interaction.deferReply();
          await interaction.editReply({ content: `Menu not exist: ${interaction.customId}` });
        }

        await menu.execute(interaction);
        await logger.debug(`Menu pressed: ${interaction.customId}`);
      } catch (err) {
        await logger.error(err);
      }
    }
  },
};
