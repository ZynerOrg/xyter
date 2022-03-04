__basedir = __dirname;
__config = require(`${__basedir}/config.json`);
const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandFiles = fs.readdirSync(`${__basedir}/src/commands`);

for (const file of commandFiles) {
  const command = require(`${__basedir}/src/commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(__config.bot.token);

rest
  .put(Routes.applicationGuildCommands(__config.bot.clientId, __config.bot.guildId), {
    body: commands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
