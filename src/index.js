require('dotenv').config();
require('./helpers/database')();

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const credits = require('./helpers/database/models/creditSchema');
const logger = require('./handlers/logger');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  await logger.info('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

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
          color: process.env.WAIT_COLOR,
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
          color: process.env.WAIT_COLOR,
          timestamp: new Date(),
        },
      ],
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  await credits
    .findOneAndUpdate(
      { userId: message.author.id },
      { $inc: { balance: 1 } },
      { new: true, upsert: true }
    )
    .then(async (data) => await logger.debug('Credits added:', message.author.id))
    .catch(async (err) => {
      await logger.error(err);
    });
});

client.login(process.env.BOT_TOKEN);
