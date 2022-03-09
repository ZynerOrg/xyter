/* eslint-disable no-restricted-syntax */
require('./deploy-commands')();
require('./helpers/database')();
require('./handlers/locale')();

const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const config = require('../config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands');

for (const file of commandFiles) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// client.buttons = new Collection();
// const buttonFiles = fs.readdirSync('./src/buttons');

// for (const file of buttonFiles) {
//   // eslint-disable-next-line import/no-dynamic-require, global-require
//   const button = require(`./buttons/${file}`);
//   client.buttons.set(button.customId, button);
// }

// client.menus = new Collection();
// const menuFiles = fs.readdirSync('./src/menus');

// for (const file of menuFiles) {
//   // eslint-disable-next-line import/no-dynamic-require, global-require
//   const menu = require(`./menus/${file}`);
//   client.menus.set(menu.customId, menu);
// }

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
