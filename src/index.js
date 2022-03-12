const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

require('./deploy-commands')();
require('./helpers/database')();
require('./handlers/locale')();

const config = require('../config.json');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const eventFiles = fs
  .readdirSync('./src/events')
  .filter((file) => file.endsWith('.js'));

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands');

for (const file of commandFiles) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(config.bot.token);
