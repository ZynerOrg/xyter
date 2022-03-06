const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const guilds = require('../../../helpers/database/models/guildSchema');

module.exports = async (interaction) => {
  try {
    const status = await interaction.options.getBoolean('status');
    const url = await interaction.options.getString('url');
    const token = await interaction.options.getString('token');
    const rate = await interaction.options.getNumber('rate');
    const minimumLength = await interaction.options.getNumber('minimum-length');

    const guild = await guilds.findOne({ guildId: interaction.member.guild.id });

    guild.credits.status = status !== null ? status : guild.credits.status;
    guild.credits.url = url !== null ? url : guild.credits.url;
    guild.credits.token = token !== null ? token : guild.credits.token;
    guild.credits.rate = rate !== null ? rate : guild.credits.rate;
    // eslint-disable-next-line max-len
    guild.credits.minimumLength = minimumLength !== null ? minimumLength : guild.credits.minimumLength;

    await guild.save();
    const embed = {
      title: 'Credits',
      description: 'Following settings is set',
      color: config.colors.success,
      fields: [{ name: 'Status', value: `${guild.credits.status}`, inline: true }, { name: 'URL', value: `${guild.credits.url}`, inline: true }, { name: 'Token', value: `${guild.credits.token}` }, { name: 'Rate', value: `${guild.credits.rate}`, inline: true }, { name: 'Minimum Length', value: `${guild.credits.minimumLength}`, inline: true }],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  } catch {
    logger.error();
  }
};
