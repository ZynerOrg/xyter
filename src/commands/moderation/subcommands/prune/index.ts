// Dependencies
import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import checkPermission from "../../../../helpers/checkPermission";
import deferReply from "../../../../helpers/deferReply";
// Configurations
import getEmbedConfig from "../../../../helpers/getEmbedConfig";

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
  const { guild, options, channel } = interaction;
  if (!channel) {
    throw new Error("The bot failed to find the channel to prune messages in.");
  }

  await deferReply(interaction, false);
  checkPermission(interaction, PermissionsBitField.Flags.ManageMessages);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const count = options.getInteger("count");
  const bots = options.getBoolean("bots");
  if (typeof count !== "number")
    throw new Error(
      "Please provide a number between 1 and 99 for the prune command."
    );

  if (count <= 0 || count >= 100) {
    throw new Error(
      "The prune command can only be used to delete between 1 and 99 messages."
    );
  }

  if (channel.type !== ChannelType.GuildText) return;

  await channel.messages.fetch().then(async (messages) => {
    let filteredMessages = messages.filter(
      (message) =>
        message.interaction && message.interaction.id !== interaction.id
    );

    if (!bots) {
      filteredMessages = filteredMessages.filter(
        (message) => message.author.bot === false
      );
    }

    const messagesToDelete = filteredMessages.first(count);

    await channel.bulkDelete(messagesToDelete, true).then(async () => {
      const interactionEmbed = new EmbedBuilder()
        .setTitle(":police_car:︱Prune")
        .setDescription(`Successfully deleted a total of ${count} messages.`)
        .setTimestamp(new Date())
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      await interaction.editReply({
        embeds: [interactionEmbed],
      });
    });
  });
};
