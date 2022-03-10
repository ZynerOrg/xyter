const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const guild = require('./guild');
const user = require('./user');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Manage settings.')
    .addSubcommandGroup((group) =>
      group
        .setName('guild')
        .setDescription('Manage guild settings.')
        .addSubcommand((command) =>
          command
            .setName('pterodactyl')
            .setDescription('Controlpanel.gg')
            .addStringOption((option) =>
              option.setName('url').setDescription('The api url').setRequired(true)
            )
            .addStringOption((option) =>
              option.setName('token').setDescription('The api token').setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('credits')
            .setDescription('Credits')
            .addBooleanOption((option) =>
              option.setName('status').setDescription('Should credits be enabled?')
            )
            .addNumberOption((option) =>
              option.setName('rate').setDescription('Amount of credits per message.')
            )
            .addNumberOption((option) =>
              option
                .setName('minimum-length')
                .setDescription('Minimum length of message to earn credits.')
            )
            .addNumberOption((option) =>
              option.setName('work-rate').setDescription('Maximum amount of credits on work.')
            )
            .addNumberOption((option) =>
              option
                .setName('work-timeout')
                .setDescription('Timeout between work schedules (milliseconds).')
            )
            .addNumberOption((option) =>
              option
                .setName('timeout')
                .setDescription('Timeout between earning credits (milliseconds).')
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName('user')
        .setDescription('Manage user settings.')
        .addSubcommand((command) =>
          command
            .setName('appearance')
            .setDescription('Manage your appearance')
            .addStringOption((option) =>
              option
                .setName('language')
                .setDescription('Configure your language')
                .addChoice('English', 'en')
                .addChoice('Swedish', 'sv')
            )
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommandGroup() === 'guild') {
      await guild(interaction);
    } else if (interaction.options.getSubcommandGroup() === 'user') {
      await user(interaction);
    }
    return true;
  },
};
