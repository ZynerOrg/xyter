__basedir = __dirname;
__config = require(`${__basedir}/../config.json`);
require('../deploy-commands')();
require('./helpers/database')();

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  }
 else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(__config.bot.token);
