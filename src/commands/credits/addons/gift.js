const config = require('../../../../config.json');
const logger = require('../../../handlers/logger');

const credits = require('../../../helpers/database/models/creditSchema');
const saveUser = require('../../../helpers/saveUser');
const creditNoun = require('../../../helpers/creditNoun');

module.exports = async (interaction) => {
  try {
    const user = await interaction.options.getUser('user');
    const amount = await interaction.options.getInteger('amount');
    const reason = await interaction.options.getString('reason');
    // eslint-disable-next-line max-len
    const data = await credits.findOne(
        {userId : interaction.user.id, guildId : interaction.member.guild.id});

    if (user.id === interaction.user.id) {
      const embed = {
        title : 'Gift failed',
        description : "You can't pay yourself.",
        color : 0xbb2124,
        timestamp : new Date(),
        footer : {iconURL : config.footer.icon, text : config.footer.text},
      };
      return await interaction.editReply(
          {embeds : [ embed ], ephemeral : true});
    }
    if (amount <= 0) {
      const embed = {
        title : 'Gift failed',
        description : "You can't pay zero or below.",
        color : 0xbb2124,
        timestamp : new Date(),
        footer : {iconURL : config.footer.icon, text : config.footer.text},
      };
      return await interaction.editReply(
          {embeds : [ embed ], ephemeral : true});
    }
    if (data.balance < amount) {
      const embed = {
        title : 'Gift',
        description :
            `You have insufficient credits. Your balance is ${data.balance}`,
        color : 0xbb2124,
        timestamp : new Date(),
        footer : {iconURL : config.footer.icon, text : config.footer.text},
      };
      return await interaction.editReply(
          {embeds : [ embed ], ephemeral : true});
    }
    // eslint-disable-next-line max-len
    const fromUser = await credits.findOne(
        {userId : interaction.user.id, guildId : interaction.member.guild.id});
    const toUser = await credits.findOne(
        {userId : user.id, guildId : interaction.member.guild.id});

    if (!toUser) {
      const embed = {
        title : 'Gift',
        description :
            'That user has no credits, I can not gift credits to the user',
        color : config.colors.error,
        timestamp : new Date(),
        footer : {iconURL : config.footer.icon, text : config.footer.text},
      };
      return interaction.editReply({embeds : [ embed ], ephemeral : true});
    }
    fromUser.balance -= amount;
    toUser.balance += amount;

    await saveUser(fromUser, toUser);

    const interactionEmbed = {
      title : 'Gift',
      description : `You sent ${creditNoun(amount)} to ${user}${
          reason ? ` with reason: ${reason}` : ''}. Your new balance is ${
          creditNoun(
              fromUser.balance,
              )}.`,
      color : 0x22bb33,
      timestamp : new Date(),
      footer : {iconURL : config.footer.icon, text : config.footer.text},
    };
    const dmEmbed = {
      title : 'Gift',
      description :
          `You received ${creditNoun(amount)} from ${interaction.user}${
              reason ? ` with reason: ${reason}` : ''}. Your new balance is ${
              creditNoun(
                  toUser.balance,
                  )}.`,
      color : 0x22bb33,
      timestamp : new Date(),
      footer : {iconURL : config.footer.icon, text : config.footer.text},
    };
    const dmUser = await interaction.client.users.cache.get(user.id);
    await dmUser.send({embeds : [ dmEmbed ]});
    await logger.debug(
        `Gift sent from: ${interaction.user.username} to: ${user.username}`);
    return await interaction.editReply(
        {embeds : [ interactionEmbed ], ephemeral : true});
  } catch (e) {
    await logger.error(e);
  }
  return true;
};
