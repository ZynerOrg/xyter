const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const credits = require('./credits');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin actions.')
    .addSubcommandGroup((group) =>
      group
        .setName('credits')
        .setDescription('Manage credits.')
        .addSubcommand((command) =>
          command
            .setName('give')
            .setDescription('Give credits to a user')
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription('The user you want to pay.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will pay.')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('set')
            .setDescription('Set credits to a user')
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription('The user you want to set credits on.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will set.')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('take')
            .setDescription('Take credits from a user')
            .addUserOption((option) =>
              option
                .setName('user')
                .setDescription('The user you want to take credits from.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will take.')
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName('transfer')
            .setDescription('Transfer credits from a user to another user.')
            .addUserOption((option) =>
              option
                .setName('from')
                .setDescription('The user you want to take credits from.')
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName('to')
                .setDescription('The user you want to give credits to.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('amount')
                .setDescription('The amount you will transfer.')
                .setRequired(true)
            )
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommandGroup() === 'credits') {
      await credits(interaction);
    }
    return true;
  },
};
