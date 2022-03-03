const credits = require('../../../helpers/database/models/creditSchema');
const logger = require('../../../handlers/logger');
const creditNoun = require('../../../helpers/creditNoun');

const api = require('../../../handlers/api.js');

const { v4: uuidv4 } = require('uuid');
module.exports = async (interaction) => {
  try {
    if (!process.env.DISABLE_REDEEM) {
      const embed = {
        title: 'Redeem failed',
        description: `Redeem is disabled until further.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const amount = await interaction.options.getInteger('amount');

    const user = await credits.findOne({ userId: interaction.user.id });

    if ((amount || user.balance) < 100) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem below 100. Your balance is ${user.balance}.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if ((amount || user.balance) > 1000000) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem over 1,000,000. Your balance is ${user.balance}.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if (user.balance < amount) {
      const embed = {
        title: 'Redeem',
        description: `You have insufficient credits. Your balance is ${user.balance}.`,
        color: 0xbb2124,
        timestamp: new Date(),
        footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else {
      const code = await uuidv4();

      await api
        .post('vouchers', {
          uses: 1,
          code,
          credits: amount || user.balance,
          memo: `${interaction.createdTimestamp} - ${interaction.user.id}`,
        })
        .then(async (res) => {
          const embed = {
            title: 'Redeem',
            description: `Your new balance is ${user.balance - (amount || user.balance)}.`,
            fields: [
              { name: 'Code', value: `${code}`, inline: true },
              {
                name: 'Credits',
                value: `${amount || user.balance}`,
                inline: true,
              },
            ],
            color: 0x22bb33,
            timestamp: new Date(),
            footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
          };
          user.balance -= amount || user.balance;

          await user.save();

          await logger.debug(`User: ${user.username} redeemed: ${creditNoun(amount)}`);
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        })
        .catch(async (err) => {
          await logger.error(err);
          const embed = {
            title: 'Redeem',
            description: 'Something went wrong.',
            color: 0xbb2124,
            timestamp: new Date(),
            footer: { iconURL: process.env.FOOTER_ICON, text: process.env.FOOTER_TEXT },
          };
          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        });
    }
  } catch {
    async (err) => await logger.error(err);
  }
};
