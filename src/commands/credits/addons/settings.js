const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const guilds = require('../../../helpers/database/models/guildSchema');

// eslint-disable-next-line consistent-return
module.exports = async (interaction) => {
  try {
    const status = await interaction.options.getBoolean('status');
    const url = await interaction.options.getString('url');
    const token = await interaction.options.getString('token');
    const rate = await interaction.options.getNumber('rate');
    const timeout = await interaction.options.getNumber('timeout');
    const minimumLength = await interaction.options.getNumber('minimum-length');
    const workRate = await interaction.options.getNumber('work-rate');
    const workTimeout = await interaction.options.getNumber('work-timeout');

    const guild = await guilds.findOne({ guildId: interaction.member.guild.id });

    guild.credits.status = status !== null ? status : guild.credits.status;
    guild.credits.url = url !== null ? url : guild.credits.url;
    guild.credits.token = token !== null ? token : guild.credits.token;
    guild.credits.rate = rate !== null ? rate : guild.credits.rate;
    guild.credits.timeout = timeout !== null ? timeout : guild.credits.timeout;
    guild.credits.workRate = workRate !== null ? workRate : guild.credits.workRate;
    // eslint-disable-next-line max-len
    guild.credits.workTimeout = workTimeout !== null ? workTimeout : guild.credits.workTimeout;
    // eslint-disable-next-line max-len
    guild.credits.minimumLength = minimumLength !== null ? minimumLength : guild.credits.minimumLength;

    await guild.save();
    const embed = {
      title: 'Credits',
      description: 'Following settings is set',
      color: config.colors.success,
      fields: [{ name: 'Status', value: `${guild.credits.status}`, inline: true },
        { name: 'URL', value: `${guild.credits.url}`, inline: true },
        { name: 'Token', value: `${guild.credits.token}` },
        { name: 'Rate', value: `${guild.credits.rate}`, inline: true },
        { name: 'Minimum Length', value: `${guild.credits.minimumLength}`, inline: true },
        { name: 'Timeout', value: `${guild.credits.timeout}`, inline: true },
        { name: 'Work Rate', value: `${guild.credits.workRate}`, inline: true },
        { name: 'Work Timeout', value: `${guild.credits.workTimeout}`, inline: true }],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed], ephemeral: true });
  } catch {
    logger.error();
  }
};
