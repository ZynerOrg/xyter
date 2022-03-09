const { SlashCommandBuilder } = require('@discordjs/builders');

const view = require('./addons/view');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Your profile.')
    .addSubcommand((subcommand) => subcommand.setName('view').setDescription('View a profile.').addUserOption((option) => option.setName('target')
      .setDescription('The profile you wish to view'))),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'view') {
      await view(interaction);
    }
    return true;
  },
};
