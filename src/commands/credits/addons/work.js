const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');
const {
  guilds,
  credits,
  timeouts,
} = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  // Destructure member
  const { member } = interaction;
  const { guild } = member;

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: guild.id,
    userId: member.id,
    timeoutId: '2022-03-15-19-16',
  });

  const guildDB = await guilds.findOne({
    guildId: guild.id,
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Make a variable of how much credits user will earn based on random multiplied with work rate
    const creditsEarned = Math.floor(Math.random() * guildDB.credits.workRate);

    const userDB = await users.findOne({
      userId: member.id,
      guildId: guild.id,
    });

    userDB.credits += creditsEarned;

    await userDB.save().then(async () => {
      // Send debug message
      await logger.debug(`Credits added to user: ${interaction.member.id}`);

      // Create embed object
      const embed = {
        title: ':dollar: Credits - Work',
        description: `You have earned ${creditNoun(creditsEarned)}`,
        color: config.colors.success,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    });

    // Create a timeout for the user
    await timeouts.create({
      guildId: guild.id,
      userId: member.id,
      timeoutId: '2022-03-15-19-16',
    });

    setTimeout(async () => {
      // Send debug message
      await logger.debug(
        `Guild: ${guild.id} User: ${member.id} has not worked within the last ${
          guildDB.work.timeout / 1000
        } seconds, work can be done`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: guild.id,
        userId: member.id,
        timeoutId: '2022-03-15-19-16',
      });
    }, guildDB.credits.workTimeout);
  } else {
    // Create embed object
    const embed = {
      title: ':dollar: Credits - Work',
      description: `You have worked within the last ${
        guildDB.credits.workTimeout / 1000
      } seconds, you can not work now!`,
      timestamp: new Date(),
      color: config.colors.error,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Send debug message
    await logger.debug(
      `Guild: ${guild.id} User: ${member.id} has worked within last day, no work can be done`
    );
  }
};
