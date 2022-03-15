const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { credits, apis } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  const { member } = interaction;
  const { guild } = member;

  // Get options
  const amount = await interaction.options.getInteger('amount');

  // Get user object
  const userDB = await users.findOne({
    userId: member.id,
    guildId: guild.id,
  });

  // Get DM user object
  const dmUser = interaction.client.users.cache.get(member.id);

  // Stop if amount or user credits is below 100
  if ((amount || userDB.credits) < 100) {
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl',
      description: `You **can't** withdraw for __Pterodactyl__ below **100**.`,
      color: config.colors.error,
      fields: [
        { name: 'Your balance', value: `${creditNoun(userDB.credits)}` },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Stop if amount or user credits is above 1.000.000
  if ((amount || userDB.credits) > 1000000) {
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl',
      description: `You **can't** withdraw for __Pterodactyl__ above **1.000.000**.`,
      color: config.colors.error,
      fields: [
        { name: 'Your balance', value: `${creditNoun(userDB.credits)}` },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Stop if user credits is below amount
  if (userDB.credits < amount) {
    const embed = {
      title: ':shopping_cart: Shop - Pterodactyl',
      description: `You have **insufficient** credits.`,
      color: config.colors.error,
      fields: [
        { name: 'Your balance', value: `${creditNoun(userDB.credits)}` },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  }

  // Generate a unique voucher for the user
  const code = uuidv4();

  // Get api object
  const apiCredentials = await apis.findOne({
    guildId: guild.id,
  });

  // Create a api instance
  const api = axios.create({
    baseURL: apiCredentials.url,
    headers: { Authorization: `Bearer ${apiCredentials.token}` },
  });

  // Get shop URL
  const shopUrl = apiCredentials.url.replace('/api', '/store');

  // Make API request
  await api

    // Make a post request to the API
    .post('vouchers', {
      uses: 1,
      code,
      credits: amount || userDB.credits,
      memo: `${interaction.createdTimestamp} - ${member.id}`,
    })

    // If successful
    .then(async () => {
      // Create DM embed object
      const dmEmbed = {
        title: ':shopping_cart: Shop - Pterodactyl',
        description: `Redeem this voucher [here](${shopUrl})!`,
        fields: [
          { name: 'Code', value: `${code}`, inline: true },
          {
            name: 'Credits',
            value: `${amount || userDB.credits}`,
            inline: true,
          },
        ],
        color: config.colors.success,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Create interaction embed object
      const interactionEmbed = {
        title: ':shopping_cart: Shop - Pterodactyl',
        description: 'I have sent you the code in DM!',
        color: config.colors.success,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Withdraw amount from user credits
      userDB.credits -= amount || userDB.credits;

      // Save new credits
      await userDB
        .save()
        // If successful
        .then(async () => {
          // Send debug message
          await logger.debug(
            `User: ${member.username} redeemed: ${creditNoun(amount)}`
          );

          // Send DM message
          await dmUser.send({ embeds: [dmEmbed] });

          // Send interaction reply
          await interaction.editReply({
            embeds: [interactionEmbed],
            ephemeral: true,
          });
        })

        // If error occurs
        .catch(async (e) => {
          await logger.error(e);
          const embed = {
            title: ':shopping_cart: Shop - Pterodactyl',
            description: 'Something went wrong, please try again later.',
            color: config.colors.error,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };
          return interaction.editReply({ embeds: [embed], ephemeral: true });
        });
    })

    // If error occurs
    .catch(async (e) => {
      await logger.error(e);
      const embed = {
        title: ':shopping_cart: Shop - Pterodactyl',
        description: 'Something went wrong, please try again later.',
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });
};
