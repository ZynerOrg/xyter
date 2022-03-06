const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

const lookup = require('./addons/lookup.js');

module.exports = {
  permissions: new Permissions([
    Permissions.FLAGS.MANAGE_MESSAGES,
    Permissions.FLAGS.ADMINISTRATOR,
  ]),
  guildOnly: true,
  botAdminOnly: false,
  data: new SlashCommandBuilder()
    .setName('utilities')
    .setDescription('Common utilities.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lookup')
        .setDescription('Lookup a domain or ip. (Request sent over HTTP, proceed with caution!)')
        .addStringOption((option) =>
          option
            .setName('target')
            .setDescription('The target you want to look up.')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'lookup') {
      await lookup(interaction);
    }
  },
};
