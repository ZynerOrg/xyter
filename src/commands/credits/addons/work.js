const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');
const guilds = require('../../../helpers/database/models/guildSchema');
const credits = require('../../../helpers/database/models/creditSchema');
const creditNoun = require('../../../helpers/creditNoun');

const workedRecently = new Set();

// eslint-disable-next-line consistent-return
module.exports = async (interaction) => {
  try {
    const guild = await guilds.findOne({guildId : interaction.member.guild.id});
    if (!workedRecently.has(interaction.member.id)) {
      const creditsEarned = Math.floor(Math.random() * guild.credits.workRate);
      await credits
          .findOneAndUpdate(
              {
                userId : interaction.member.id,
                guildId : interaction.member.guild.id
              },
              {$inc : {balance : creditsEarned}},
              {new : true, upsert : true},
              )
          .then(async () => {
            logger.debug(`Credits added to user: ${interaction.member.id}`);
            const embed = {
              title : 'Work',
              description : `You earned ${creditNoun(creditsEarned)}`,
              color : config.colors.success,
              timestamp : new Date(),
              footer :
                  {iconURL : config.footer.icon, text : config.footer.text},
            };

            return interaction.editReply(
                {embeds : [ embed ], ephemeral : true});
          })
          .catch(async (err) => { await logger.error(err); });

      workedRecently.add(interaction.member.id);
      setTimeout(() => {
        logger.debug(
            `User: ${interaction.member.id} has not worked within last ${
                guild.credits.workTimeout / 1000} seconds, work can be runned`,
        );
        workedRecently.delete(interaction.member.id);
      }, guild.credits.timeout);
    } else {
      logger.debug(
          `User: ${interaction.member.id} has already worked within last ${
              guild.credits.workTimeout / 1000} seconds, no work is runned`,
      );
      const embed = {
        title : 'Work',
        description : `You can not work now, wait ${
            guild.credits.workTimeout / 1000} seconds until timeout is out.`,
        color : config.colors.error,
        timestamp : new Date(),
        footer : {iconURL : config.footer.icon, text : config.footer.text},
      };

      return interaction.editReply({embeds : [ embed ], ephemeral : true});
    }
  } catch (e) {
    await logger.error(e);
  }
};
