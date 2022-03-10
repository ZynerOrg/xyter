const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const config = require('../../../config.json');
const guilds = require('../../helpers/database/models/guildSchema');

const balance = require('./addons/balance');
const gift = require('./addons/gift');
const redeem = require('./addons/redeem');
const top = require('./addons/top');
const work = require('./addons/work');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Manage your credits.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('balance')
        .setDescription("Check a user's balance.")
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user whose balance you want to check.')
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('redeem')
        .setDescription('Redeem your credits.')
        .addIntegerOption((option) =>
          option.setName('amount').setDescription('How much credit you want to withdraw.')
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('gift')
        .setDescription('Gift someone credits from your credits.')
        .addUserOption((option) =>
          option.setName('user').setDescription('The user you want to pay.').setRequired(true)
        )
        .addIntegerOption((option) =>
          option.setName('amount').setDescription('The amount you will pay.').setRequired(true)
        )
        .addStringOption((option) => option.setName('reason').setDescription('Your reason.'))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('top').setDescription('Check the top balance.')
    )
    .addSubcommand((subcommand) => subcommand.setName('work').setDescription('Work for credits.')),
  async execute(interaction) {
    const guild = await guilds.findOne({ guildId: interaction.member.guild.id });

    if (guild.credits.status === false && interaction.options.getSubcommand() !== 'settings') {
      const embed = {
        title: 'Credits',
        description: 'Please enable credits by ``/credits settings``',
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    if (interaction.options.getSubcommand() === 'balance') {
      await balance(interaction);
    } else if (interaction.options.getSubcommand() === 'gift') {
      await gift(interaction);
    } else if (interaction.options.getSubcommand() === 'redeem') {
      await redeem(interaction);
    } else if (interaction.options.getSubcommand() === 'top') {
      await top(interaction);
    } else if (interaction.options.getSubcommand() === 'work') {
      await work(interaction);
    }
    return true;
  },
};
