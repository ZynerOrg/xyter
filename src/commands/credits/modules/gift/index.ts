// Dependencies
// Models
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import transferCredits from "../../../../helpers/transferCredits";
// Configurations
import getEmbedConfig from "../../../../helpers/getEmbedData";
// Handlers

// Function
export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("gift")
      .setDescription(`Gift a user credits`)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to gift credits to.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount of credits you want to gift.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("reason").setDescription("Your reason.")
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, user, guild, client } = interaction;

    const optionUser = options.getUser("user");
    const optionAmount = options.getInteger("amount");
    const optionReason = options.getString("reason");

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Gift")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (!guild) throw new Error("Guild not found");
    if (!optionUser) throw new Error("No receiver found");
    if (optionAmount === null) throw new Error("Amount not found");

    await transferCredits(guild, user, optionUser, optionAmount);

    // Get DM user object
    const dmUser = client.users.cache.get(optionUser.id);

    if (!dmUser) throw new Error("User not found");

    // Send DM to user
    await dmUser.send({
      embeds: [
        embed
          .setDescription(
            `${user.tag} has gifted you ${optionAmount} credits with reason: ${
              optionReason || "unspecified"
            }`
          )
          .setColor(successColor),
      ],
    });

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `Successfully gifted ${optionAmount} credits to ${optionUser} with reason: ${
              optionReason || "unspecified"
            }`
          )
          .setColor(successColor),
      ],
    });
  },
};
