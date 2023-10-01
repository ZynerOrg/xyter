import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  Guild,
  SlashCommandSubcommandBuilder,
  User,
  codeBlock,
} from "discord.js";
import CreditsManager from "../../../../handlers/CreditsManager";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
import deferReply from "../../../../utils/deferReply";
import { GuildNotFoundError } from "../../../../utils/errors";
import sendResponse from "../../../../utils/sendResponse";

const creditsManager = new CreditsManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("gift")
    .setDescription("🎁 Gift credits to an account")
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription("👤 The account you want to gift to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("💰 The amount you want to gift")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(2147483647)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("💬 Your personalized message to the account")
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options, user, guild } = interaction;

  await deferReply(interaction, true);
  if (!guild) throw new GuildNotFoundError();

  const recipient = options.getUser("account", true);
  const amount = options.getInteger("amount");
  const message = options.getString("message");

  if (typeof amount !== "number" || amount < 1) {
    throw new Error("Please enter a valid number of credits to gift");
  }

  await upsertGuildMember(guild, user);

  await creditsManager.transfer(guild, user, recipient, amount);

  const recipientEmbed = await createRecipientEmbed(
    user,
    guild,
    recipient,
    amount,
    message
  );
  const senderEmbed = await createSenderEmbed(
    guild,
    user,
    recipient,
    amount,
    message
  );

  await recipient.send({ embeds: [recipientEmbed] });

  await sendResponse(interaction, { embeds: [senderEmbed] });
};

const createRecipientEmbed = async (
  sender: User,
  guild: Guild,
  recipient: User,
  amount: number,
  message: string | null
) => {
  const recipientEmbed = new EmbedBuilder()
    .setTimestamp()
    .setAuthor({
      name: `🎁 ${sender.username} sent you a gift!`,
    })
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setDescription(`You've received ${amount} credits as a gift!`)
    .setThumbnail(sender.displayAvatarURL())
    .setFooter({
      text: `You received this gift in guild ${guild.name}`,
      iconURL: guild.iconURL() || "",
    });

  if (message) {
    recipientEmbed.addFields({
      name: "Message",
      value: codeBlock(message),
    });
  }

  return recipientEmbed;
};

const createSenderEmbed = async (
  guild: Guild,
  sender: User,
  recipient: User,
  amount: number,
  message: string | null
) => {
  const senderEmbed = new EmbedBuilder()
    .setTimestamp()
    .setAuthor({
      name: `🎁 You sent a gift to ${recipient.username}!`,
    })
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setDescription(`You've sent ${amount} credits as a gift!`)
    .setThumbnail(recipient.displayAvatarURL())
    .setFooter({
      text: `The recipient received this gift in guild ${guild.name}`,
      iconURL: guild.iconURL() || "",
    });

  if (message) {
    senderEmbed.addFields({
      name: "Message",
      value: codeBlock(message),
    });
  }

  return senderEmbed;
};
