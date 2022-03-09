const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { guilds, credits, apis } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

// const api = require('../../../handlers/api');

module.exports = async (interaction) => {
  try {
    if (config.disable.redeem) {
      const embed = {
        title: 'Redeem failed',
        description: 'Redeem is disabled until further.',
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const amount = await interaction.options.getInteger('amount');

    // eslint-disable-next-line max-len
    const user = await credits.findOne({
      userId: interaction.user.id,
      guildId: interaction.member.guild.id,
    });
    const dmUser = interaction.client.users.cache.get(interaction.member.user.id);

    if ((amount || user.balance) < 100) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem below 100. Your balance is ${user.balance}.`,
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    if ((amount || user.balance) > 1000000) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem over 1,000,000. Your balance is ${user.balance}.`,
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    if (user.balance < amount) {
      const embed = {
        title: 'Redeem',
        description: `You have insufficient credits. Your balance is ${user.balance}.`,
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const code = uuidv4();

    const apiCredentials = await apis.findOne({ guildId: interaction.member.guild.id });

    const api = axios.create({
      baseURL: apiCredentials.url,
      headers: { Authorization: `Bearer ${apiCredentials.token}` },
    });

    await api
      .post('vouchers', {
        uses: 1,
        code,
        credits: amount || user.balance,
        memo: `${interaction.createdTimestamp} - ${interaction.user.id}`,
      })
      .then(async () => {
        const dmEmbed = {
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
          color: config.colors.success,
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        const interactionEmbed = {
          title: 'Redeem',
          description: 'Code is sent in DM!',
          color: config.colors.success,
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        user.balance -= amount || user.balance;

        await user.save();

        await logger.debug(`User: ${user.username} redeemed: ${creditNoun(amount)}`);
        await dmUser.send({ embeds: [dmEmbed] });
        await interaction.editReply({ embeds: [interactionEmbed], ephemeral: true });
      })
      .catch(async (e) => {
        await logger.error(e);
        const embed = {
          title: 'Redeem',
          description: 'Something went wrong.',
          color: config.colors.error,
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        return interaction.editReply({ embeds: [embed], ephemeral: true });
      });
  } catch (e) {
    await logger.error(e);
  }
  return true;
};
