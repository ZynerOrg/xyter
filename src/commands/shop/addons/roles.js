const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { guilds, users } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  const name = interaction.options.getString('name');

  const { member } = interaction;
  const { guild } = member;

  const guildDB = await guilds.findOne({ guildId: guild.id });

  guild.roles
    .create({
      data: {
        name,
        color: 'BLUE',
      },
      reason: `${interaction.member.id} bought from shop`,
    })
    .then(async (role) => {
      console.log(role);
      userDB.credits -= guildDB.shop.roles.pricePerHour;
      await userDB.save().then(async () => {
        const embed = {
          title: ':shopping_cart: Shop - Roles',
          description: `You have bought ${role.name} for ${guildDB.shop.roles.pricePerHour} per hour.`,
          color: config.colors.error,
          fields: [
            { name: 'Your balance', value: `${creditNoun(userDB.credits)}` },
          ],
          timestamp: new Date(),
          footer: { iconURL: config.footer.icon, text: config.footer.text },
        };
        return await interaction.editReply({
          embeds: [embed],
          ephemeral: true,
        });
      });
    })
    .catch(console.error);
};
