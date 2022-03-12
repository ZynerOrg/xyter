const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const lookup = require('./addons/lookup');
const users = require('./addons/users');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('utilities')
    .setDescription('Common utilities.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lookup')
        .setDescription(
          'Lookup a domain or ip. (Request sent over HTTP, proceed with caution!)'
        )
        .addStringOption((option) =>
          option
            .setName('target')
            .setDescription('The target you want to look up.')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('users').setDescription('Iterate all users (ADMIN)')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'lookup') {
      await lookup(interaction);
    } else if (interaction.options.getSubcommand() === 'users') {
      await users(interaction);
    }
  },
};
