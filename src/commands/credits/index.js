const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

const config = require('../../../config.json');
const guilds = require('../../helpers/database/models/guildSchema');

const balance = require('./addons/balance');
const gift = require('./addons/gift');
const give = require('./addons/give');
const redeem = require('./addons/redeem');
const take = require('./addons/take');
const top = require('./addons/top');
const transfer = require('./addons/transfer');
const set = require('./addons/set');
const settings = require('./addons/settings');

module.exports = {
  permissions: new Permissions([
    Permissions.FLAGS.MANAGE_MESSAGES,
    Permissions.FLAGS.ADMINISTRATOR,
  ]),
  guildOnly: true,
  botAdminOnly: false,
  data: new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Manage your credits.')
    .addSubcommand((subcommand) => subcommand
      .setName('give')
      .setDescription('Give credits to a user. (ADMIN)')
      .addUserOption((option) => option.setName('user').setDescription('The user you want to pay.').setRequired(true))
      .addIntegerOption((option) => option.setName('amount').setDescription('The amount you will pay.').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('take')
      .setDescription('Take credits from a user. (ADMIN)')
      .addUserOption((option) => option
        .setName('user')
        .setDescription('The user you want to take credits from.')
        .setRequired(true))
      .addIntegerOption((option) => option.setName('amount').setDescription('The amount you will take.').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('balance')
      .setDescription("Check a user's balance.")
      .addUserOption((option) => option
        .setName('user')
        .setDescription('The user whose balance you want to check.')
        .setRequired(false)))
    .addSubcommand((subcommand) => subcommand
      .setName('redeem')
      .setDescription('Redeem your credits.')
      .addIntegerOption((option) => option.setName('amount').setDescription('How much credit you want to withdraw.')))
    .addSubcommand((subcommand) => subcommand
      .setName('gift')
      .setDescription('Gift someone credits from your credits.')
      .addUserOption((option) => option.setName('user').setDescription('The user you want to pay.').setRequired(true))
      .addIntegerOption((option) => option.setName('amount').setDescription('The amount you will pay.').setRequired(true))
      .addStringOption((option) => option.setName('reason').setDescription('Your reason.')))
    .addSubcommand((subcommand) => subcommand.setName('top').setDescription('Check the top balance.'))
    .addSubcommand((subcommand) => subcommand
      .setName('transfer')
      .setDescription('Transfer credits from a user to another user. (ADMIN)')
      .addUserOption((option) => option
        .setName('from')
        .setDescription('The user you want to take credits from.')
        .setRequired(true))
      .addUserOption((option) => option
        .setName('to')
        .setDescription('The user you want to give credits to.')
        .setRequired(true))
      .addIntegerOption((option) => option.setName('amount').setDescription('The amount you will transfer.').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('set')
      .setDescription('Set credits on a user. (ADMIN)')
      .addUserOption((option) => option
        .setName('user')
        .setDescription('The user you want to set credits on.')
        .setRequired(true))
      .addIntegerOption((option) => option.setName('amount').setDescription('The amount you will set.').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('settings')
      .setDescription('Manage credit settings. (ADMIN)')
      .addBooleanOption((option) => option
        .setName('status')
        .setDescription('Toggle credits.'))
      .addStringOption((option) => option
        .setName('url')
        .setDescription('Controlpanel.gg URL.'))
      .addStringOption((option) => option
        .setName('token')
        .setDescription('Controlpanel.gg token.'))
      .addNumberOption((option) => option
        .setName('rate')
        .setDescription('Credits rate.'))
      .addNumberOption((option) => option
        .setName('minimum-length')
        .setDescription('Minimum length for credits.'))
      .addNumberOption((option) => option
        .setName('timeout')
        .setDescription('Timeout between credits (milliseconds).'))),
  async execute(interaction) {
    const guild = await guilds.findOne({ guildId: interaction.member.guild.id });

    if (interaction.options.getSubcommand() === 'settings') {
      await settings(interaction);
    }

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
    } else if (interaction.options.getSubcommand() === 'give') {
      await give(interaction);
    } else if (interaction.options.getSubcommand() === 'redeem') {
      await redeem(interaction);
    } else if (interaction.options.getSubcommand() === 'take') {
      await take(interaction);
    } else if (interaction.options.getSubcommand() === 'top') {
      await top(interaction);
    } else if (interaction.options.getSubcommand() === 'transfer') {
      await transfer(interaction);
    } else if (interaction.options.getSubcommand() === 'set') {
      await set(interaction);
    }
    return true;
  },
};
