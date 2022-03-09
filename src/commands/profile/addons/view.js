const i18next = require('i18next');
const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const { users, credits, experiences } = require('../../../helpers/database/models');

module.exports = async (interaction) => {
  try {
    const { member } = await interaction;

    // Options
    const target = await interaction.options.getUser('target');

    const discordUser = await interaction.client.users.fetch(`${target ? target.id : member.id}`);

    // Databases
    //   Fetch user from user
    const user = await users.findOne(
      { userId: await discordUser.id },
    );

    //   Fetch credit from user and guild
    const experience = await experiences.findOne(
      {
        userId: await discordUser.id,
        guildId: await member.guild.id,
      },
    );

    //   Fetch credit from user and guild
    const credit = await credits.findOne(
      {
        userId: await discordUser.id,
        guildId: await member.guild.id,
      },
    );

    // Language variables
    const notAvailableText = i18next.t('general:not_available', { lng: await user.language });
    const reputationText = i18next.t('commands:profile:addons:view:embed:reputation', { lng: await user.language });
    const levelText = i18next.t('commands:profile:addons:view:embed:level', { lng: await user.language });
    const pointsText = i18next.t('commands:profile:addons:view:embed:points', { lng: await user.language });
    const creditsText = i18next.t('commands:profile:addons:view:embed:credits', { lng: await user.language });
    const languageCodeText = i18next.t('commands:profile:addons:view:embed:language_code', { lng: await user.language });

    // Create embed
    const embed = {
      author: {
        name: `${await discordUser.username}#${await discordUser.discriminator}`,
        icon_url: await discordUser.displayAvatarURL(),
      },
      color: config.colors.success,
      fields: [
        { name: `:loudspeaker: ${reputationText}`, value: `${await user.reputation || `${notAvailableText}`}`, inline: true },
        { name: `:squeeze_bottle: ${levelText}`, value: `${await experience.level || `${notAvailableText}`}`, inline: true },
        { name: `:squeeze_bottle: ${pointsText}`, value: `${await experience.points || `${notAvailableText}`}`, inline: true },
        { name: `:money_with_wings: ${creditsText}`, value: `${await credit.balance || `${notAvailableText}`}`, inline: true },
        { name: `:rainbow_flag: ${languageCodeText}`, value: `${await user.language || `${notAvailableText}`}`, inline: true },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send reply
    return await interaction.editReply({ embeds: [embed], ephemeral: true });
  } catch (e) {
    await logger.error(e);
  }
  return true;
};
