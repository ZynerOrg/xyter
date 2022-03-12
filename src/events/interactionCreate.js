const config = require('../../config.json');
const logger = require('../handlers/logger');

const { guilds } = require('../helpers/database/models');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const { member, client } = interaction;

    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      await guilds.findOne(
        { guildId: member.guild.id },
        { new: true, upsert: true }
      );

      try {
        await interaction.deferReply({
          embeds: [
            {
              author: {
                name: client.user.username,
                icon_url: client.user.displayAvatarURL(),
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
                name: client.user.username,
                icon_url: client.user.displayAvatarURL(),
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
    }

    // else if (interaction.isButton()) {
    //   const button = client.buttons.get(interaction.customId);

    //   try {
    //     if (!button) {
    //       await interaction.deferReply();
    //       await interaction.editReply({ content: `Button not exist: ${interaction.customId}` });
    //     }

    //     await button.execute(interaction);
    //     await logger.debug(`Button pressed: ${interaction.customId}`);
    //   } catch (err) {
    //     await logger.error(err);
    //   }
    // } else if (interaction.isSelectMenu()) {
    //   const menu = client.menus.get(interaction.customId);

    //   try {
    //     if (!menu) {
    //       await interaction.deferReply();
    //       await interaction.editReply({ content: `Menu not exist: ${interaction.customId}` });
    //     }

    //     await menu.execute(interaction);
    //     await logger.debug(`Menu pressed: ${interaction.customId}`);
    //   } catch (err) {
    //     await logger.error(err);
    //   }
    // }
  },
};
