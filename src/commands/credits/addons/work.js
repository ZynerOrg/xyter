const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');
const { guilds, credits, timeouts } = require('../../../helpers/database/models');
const creditNoun = require('../../../helpers/creditNoun');

const workedRecently = new Set();

// eslint-disable-next-line consistent-return
module.exports = async (interaction) => {
  const { member } = interaction;

  // Check if user has a timeout

  const isTimeout = await timeouts.findOne(
    {
      guildId: member.guild.id,
      userId: member.id,
      timeoutId: 3,
    },
  );

  // If user is not on timeout

  if (!isTimeout) {
    const guild = await guilds.findOne({ guildId: interaction.member.guild.id });
    if (!workedRecently.has(interaction.member.id)) {
      const creditsEarned = Math.floor(Math.random() * guild.credits.workRate);
      await credits
        .findOneAndUpdate(
          {
            userId: interaction.member.id,
            guildId: interaction.member.guild.id,
          },
          { $inc: { balance: creditsEarned } },
          { new: true, upsert: true },
        )
        .then(async () => {
          logger.debug(`Credits added to user: ${interaction.member.id}`);
          const embed = {
            title: 'Work',
            description: `You earned ${creditNoun(creditsEarned)}`,
            color: config.colors.success,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };

          return interaction.editReply({ embeds: [embed], ephemeral: true });
        })
        .catch(async (err) => {
          await logger.error(err);
        });

      workedRecently.add(interaction.member.id);
      setTimeout(() => {
        logger.debug(
          `User: ${interaction.member.id} has not worked within last ${
            guild.credits.workTimeout / 1000
          } seconds, work can be runned`,
        );
        workedRecently.delete(interaction.member.id);
      }, guild.credits.workTimeout);
    } else {
      logger.debug(
        `User: ${interaction.member.id} has already worked within last ${
          guild.credits.workTimeout / 1000
        } seconds, no work is runned`,
      );
      const embed = {
        title: 'Work',
        description: `You can not work now, wait ${
          guild.credits.workTimeout / 1000
        } seconds until timeout is out.`,
        color: config.colors.error,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }

    // Create a timeout for the user

    await timeouts.create(
      {
        guildId: member.guild.id,
        userId: member.id,
        timeoutId: 3,
      },
    );

    setTimeout(async () => {
      await logger.debug(
        `Guild: ${member.guild.id} User: ${member.id} has not worked within the last ${guild.work.timeout / 1000} seconds, work can be done`,
      );

      // When timeout is out, remove it from the database

      await timeouts.deleteOne({
        guildId: member.guild.id,
        userId: member.id,
        timeoutId: 3,
      });
    }, 86400000);
  } else {
    const embed = {
      title: 'Work',
      description: `You have worked within the last ${guild.work.timeout / 1000} seconds, you can not work now!`,
      timestamp: new Date(),
      color: config.colors.error,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    await interaction.editReply({ embeds: [embed] });

    await logger.debug(
      `Guild: ${member.guild.id} User: ${member.id} has worked within last day, no work can be done`,
    );
  }
};
