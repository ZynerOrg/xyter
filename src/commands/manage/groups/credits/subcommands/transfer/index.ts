import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import CreditsManager from "../../../../../../handlers/CreditsManager";
import checkPermission from "../../../../../../utils/checkPermission";
import deferReply from "../../../../../../utils/deferReply";
import { GuildNotFoundError } from "../../../../../../utils/errors";
import sendResponse from "../../../../../../utils/sendResponse";

const creditsManager = new CreditsManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("transfer")
    .setDescription("Transfer credits from a user to another.")
    .addUserOption((option) =>
      option
        .setName("from-user")
        .setDescription("The user to take credits from.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("to-user")
        .setDescription("The user to give credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to set.`)
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(2147483647)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const { guild, options, user } = interaction;

  await deferReply(interaction, false);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);
  if (!guild) throw new GuildNotFoundError();

  const fromUser = options.getUser("from-user", true);
  const toUser = options.getUser("to-user", true);
  const creditsAmount = options.getInteger("amount", true);

  const transactionResult = await creditsManager.transfer(
    guild,
    fromUser,
    toUser,
    creditsAmount
  );

  // Constructing the transfer embed
  const transferEmbed = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .addFields(
      { name: "📤 Sender", value: fromUser.username, inline: true },
      { name: "📥 Recipient", value: toUser.username, inline: true },
      {
        name: "💰 Transferred Amount",
        value: `${transactionResult.transferredAmount}`,
        inline: true,
      },
      {
        name: "🪙 Sender Balance",
        value: `${transactionResult.fromTransaction.balance}`,
        inline: true,
      },
      {
        name: "🪙 Recipient Balance",
        value: `${transactionResult.toTransaction.balance}`,
        inline: true,
      }
    )
    .setAuthor({ name: "This is an administrative action." })
    //.setThumbnail(user.displayAvatarURL())
    .setFooter({
      text: `Action by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  // Adding explanation if not all credits were transferred
  if (creditsAmount !== transactionResult.transferredAmount) {
    transferEmbed.setAuthor({
      name: `⚠️ Some credits could not be transferred.`,
    });
    const explanation = `*This is because the transfer amount exceeded the maximum allowed limit.*`;
    transferEmbed.setDescription(explanation);
  } else {
    transferEmbed.setAuthor({
      name: "✅ All credits have been successfully transferred.",
    });
  }

  await sendResponse(interaction, { embeds: [transferEmbed] });
};
