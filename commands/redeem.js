const { SlashCommandBuilder } = require('@discordjs/builders');

const { disableRedeem } = require('../config.json');

const db = require('quick.db');

const credits = new db.table('credits');

const api = require('../handlers/api.js');

const { v4: uuidv4 } = require('uuid');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redeem')
    .setDescription('Redeem your credits.')
    .addIntegerOption((option) =>
      option.setName('amount').setDescription('How much credit you want to withdraw.')
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (disableRedeem) {
      const embed = {
        title: 'Redeem failed',
        description: `Redeem is disabled until further.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { text: 'Zyner Bot' },
      };
      return await await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const amount = await interaction.options.getInteger('amount');

    const userCredits = await credits.get(interaction.user.id);

    if ((amount || userCredits) < 100) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem below 100. Your balance is ${userCredits}.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { text: 'Zyner Bot' },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if ((amount || userCredits) > 1000000) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem over 1,000,000. Your balance is ${userCredits}.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { text: 'Zyner Bot' },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if (userCredits < amount) {
      const embed = {
        title: 'Redeem',
        description: `You have insufficient credits. Your balance is ${userCredits}.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { text: 'Zyner Bot' },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      const code = uuidv4();

      api
        .post('vouchers', {
          uses: 1,
          code,
          credits: amount || userCredits,
          memo: `${interaction.createdTimestamp} - ${interaction.user.id}`,
        })
        .then(async (res) => {
          const embed = {
            title: 'Redeem',
            description: `Your new balance is ${userCredits - (amount || userCredits)}.`,
            fields: [
              { name: 'Code', value: `${code}`, inline: true },
              {
                name: 'Credits',
                value: `${amount || userCredits}`,
                inline: true,
              },
            ],
            color: 0x22bb33,
            timestamp: new Date(),
            footer: { text: 'Zyner Bot' },
          };
          await credits.subtract(interaction.user.id, amount || userCredits);

          await interaction.editReply({ embeds: [embed], ephemeral: true });
        })
        .catch(async (err) => {
          console.log(err);
          const embed = {
            title: 'Redeem',
            description: 'Something went wrong.',
            color: 0xbb2124,
            timestamp: new Date(),
            footer: { text: 'Zyner Bot' },
          };
          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        });
    }
  },
};
