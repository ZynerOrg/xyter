import { GuildMemberCredit } from "@prisma/client";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  User,
} from "discord.js";
import CreditsManager from "../../../../handlers/CreditsManager";
import deferReply from "../../../../utils/deferReply";
import { GuildNotFoundError } from "../../../../utils/errors";
import sendResponse from "../../../../utils/sendResponse";

const creditsManager = new CreditsManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("balance")
    .setDescription(`View account balance`)
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription(
          "Enter the username of another user to check their balance"
        )
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options, user, guild } = interaction;

  await deferReply(interaction, false);
  if (!guild) throw new GuildNotFoundError();

  const checkAccount = options.getUser("account") || user;
  const creditAccount = await creditsManager.balance(guild, checkAccount);

  const isUserCheckAccount = checkAccount.id === user.id;
  const pronoun = isUserCheckAccount ? "You" : "They";
  const possessivePronoun = isUserCheckAccount ? "Your" : "Their";

  const description = getAccountBalanceDescription(
    creditAccount,
    checkAccount,
    isUserCheckAccount,
    pronoun,
    possessivePronoun
  );

  await sendAccountBalanceEmbed(
    interaction,
    description,
    checkAccount,
    pronoun,
    possessivePronoun
  );
};

const getAccountBalanceDescription = (
  creditAccount: GuildMemberCredit,
  checkAccount: User,
  isUserCheckAccount: boolean,
  pronoun: string,
  possessivePronoun: string
) => {
  let description = `${
    isUserCheckAccount ? "You" : checkAccount
  } currently have ${creditAccount.balance} credits. 💰\n\n`;

  if (creditAccount.balance === 0) {
    description += `${possessivePronoun} wallet is empty. Encourage ${
      isUserCheckAccount ? "yourself" : "them"
    } to start earning credits by participating in community events and challenges!`;
  } else if (creditAccount.balance < 100) {
    description += `${pronoun}'re making progress! Keep earning credits and unlock exciting rewards.`;
  } else if (creditAccount.balance < 500) {
    description += `Great job! ${possessivePronoun} account balance is growing. ${pronoun}'re on ${possessivePronoun.toLowerCase()} way to becoming a credit millionaire!`;
  } else {
    description += `Wow! ${pronoun}'re a credit master with a substantial account balance. Enjoy the perks and exclusive benefits!`;
  }

  return description;
};

const sendAccountBalanceEmbed = async (
  interaction: ChatInputCommandInteraction,
  description: string,
  checkAccount: User,
  pronoun: string,
  possessivePronoun: string
) => {
  await sendResponse(interaction, {
    embeds: [
      new EmbedBuilder()
        .setColor("#FDD835")
        .setAuthor({ name: "💳 Account Balance" })
        .setDescription(description)
        .setThumbnail(checkAccount.displayAvatarURL())
        .setFooter({
          text: `${possessivePronoun} credit balance reflects ${possessivePronoun.toLowerCase()} community engagement!`,
        })
        .setTimestamp(),
    ],
  });
};
