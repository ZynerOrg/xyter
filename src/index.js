const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();

require('./helpers/database')();

const credits = require('./helpers/database/models/creditSchema');

// const db = require('quick.db');
//
// const credits = new db.table('credits');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  credits
    .findOneAndUpdate(
      { userId: message.author.id },
      { $inc: { balance: 1 } },
      { new: true, upsert: true }
    )
    .then(async (data) => console.log(data))
    .catch(async (err) => {
      console.log(err);
    });

  console.log(message.author, message.content);
});

client.login(process.env.BOT_TOKEN);
