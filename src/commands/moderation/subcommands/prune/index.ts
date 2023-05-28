// Dependencies
import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import checkPermission from "../../../../utils/checkPermission";
import deferReply from "../../../../utils/deferReply";
import sendResponse from "../../../../utils/sendResponse";

// Function
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("prune")
    .setDescription("Prune messages!")
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("How many messages you wish to prune")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(99)
    )
    .addBooleanOption((option) =>
      option
        .setName("bots")
        .setDescription("Should bot messages be pruned too?")
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { user, options, channel } = interaction;
  if (!channel) {
    throw new Error("The bot failed to find the channel to prune messages in.");
  }

  await deferReply(interaction, false);
  checkPermission(interaction, PermissionsBitField.Flags.ManageMessages);

  const count = options.getInteger("count");
  const bots = options.getBoolean("bots");
  if (!count || count < 1 || count > 99) {
    throw new Error(
      "Please provide a number between 1 and 99 for the prune command."
    );
  }

  if (channel.type !== ChannelType.GuildText) return;

  const messagesToDelete = await channel.messages
    .fetch({ limit: count + 1 }) // Fetch count + 1 messages to exclude the interaction message itself
    .then((messages) => {
      let filteredMessages = messages;
      if (!bots) {
        filteredMessages = filteredMessages.filter(
          (message) => !message.author.bot
        );
      }
      return filteredMessages;
    });

  const firstMessage = messagesToDelete.first();
  if (firstMessage) messagesToDelete.delete(firstMessage.id);

  const messagesToDeleteArray = [...messagesToDelete.values()]; // Convert Collection to an array

  await channel.bulkDelete(messagesToDeleteArray, true).then(async () => {
    const interactionEmbed = new EmbedBuilder()
      .setColor(process.env.EMBED_COLOR_SUCCESS)
      .setAuthor({ name: "🤖 Moderation" })
      .setDescription(
        `Successfully deleted ${messagesToDeleteArray.length} messages.`
      )
      .setFooter({
        text: `Action by ${user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setTimestamp();

    await sendResponse(interaction, {
      embeds: [interactionEmbed],
    });
  });
};
