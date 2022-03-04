const credits = require(`${__basedir}/helpers/database/models/creditSchema`);
const logger = require(`${__basedir}/handlers/logger`);
const creditNoun = require(`${__basedir}/helpers/creditNoun`);

const api = require(`${__basedir}/handlers/api.js`);

const { v4: uuidv4 } = require('uuid');
module.exports = async (interaction) => {
  try {
    if (__config.disable.redeem) {
      const embed = {
        title: 'Redeem failed',
        description: `Redeem is disabled until further.`,
        color: __config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    const amount = await interaction.options.getInteger('amount');

    const user = await credits.findOne({ userId: interaction.user.id });
    const dmUser = interaction.client.users.cache.get(interaction.member.user.id);

    if ((amount || user.balance) < 100) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem below 100. Your balance is ${user.balance}.`,
        color: __config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if ((amount || user.balance) > 1000000) {
      const embed = {
        title: 'Redeem',
        description: `You can't redeem over 1,000,000. Your balance is ${user.balance}.`,
        color: __config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
      };
      return await interaction.editReply({ embeds: [embed], ephemeral: true });
    } else if (user.balance < amount) {
      const embed = {
        title: 'Redeem',
        description: `You have insufficient credits. Your balance is ${user.balance}.`,
        color: __config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: __config.footer.icon, text: __config.footer.text },
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
            color: __config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };
          const interactionEmbed = {
            title: 'Redeem',
            description: `Code is sent in DM!`,
            color: __config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };
          user.balance -= amount || user.balance;

          await user.save();

          await logger.debug(`User: ${user.username} redeemed: ${creditNoun(amount)}`);
          await dmUser.send({ embeds: [dmEmbed] });
          await interaction.editReply({ embeds: [interactionEmbed], ephemeral: true });
        })
        .catch(async (err) => {
          await logger.error(err);
          const embed = {
            title: 'Redeem',
            description: 'Something went wrong.',
            color: __config.colors.error,
            timestamp: new Date(),
            footer: { iconURL: __config.footer.icon, text: __config.footer.text },
          };
          return await interaction.editReply({ embeds: [embed], ephemeral: true });
        });
    }
  } catch {
    async (err) => await logger.error(err);
  }
};
