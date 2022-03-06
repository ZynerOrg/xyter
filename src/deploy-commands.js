/* eslint-disable no-restricted-syntax */
const config = require('../config.json');

const logger = require('./handlers/logger');

module.exports = async () => {
  // eslint-disable-next-line global-require
  const fs = require('fs');
  // eslint-disable-next-line global-require
  const { REST } = require('@discordjs/rest');
  // eslint-disable-next-line global-require
  const { Routes } = require('discord-api-types/v9');

  const commands = [];
  const commandFiles = fs.readdirSync('./src/commands');

  for (const file of commandFiles) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(config.bot.token);

  rest
    .put(Routes.applicationGuildCommands(config.bot.clientId, config.bot.guildId), {
      body: commands,
    })
    .then(async () => logger.info('Successfully registered application commands.'))
    .catch(async (err) => {
      await logger.error(err);
    });
};
