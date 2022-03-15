const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../../config.json');
const logger = require('../../../../handlers/logger');

const {
  users,
  shopRoles,
  guilds,
} = require('../../../../helpers/database/models');
const creditNoun = require('../../../../helpers/creditNoun');

module.exports = async (interaction) => {
  const { member } = interaction;
  const { guild } = member;

  const role = await interaction.options.getRole('role');

  const roleExist = await shopRoles.find({
    guildId: guild.id,
    userId: member.id,
    roleId: role.id,
  });

  if (roleExist) {
    await member.roles.remove(role.id);

    await interaction.guild.roles
      .delete(role.id, `${interaction.member.id} canceled from shop`)
      .then(async () => {
        // Get guild object
        const guildDB = await guilds.findOne({
          guildId: interaction.member.guild.id,
        });

        const userDB = await users.findOne({
          userId: member.id,
          guildId: guild.id,
        });

        await shopRoles.deleteOne({
          roleId: role.id,
          userId: member.id,
          guildId: guild.id,
        });

        const embed = {
          title: ':shopping_cart: Shop - Roles [Buy]',
          description: `You have canceled ${role.name}.`,
          color: config.colors.success,
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
      })
      .catch(console.error);
  }
};
