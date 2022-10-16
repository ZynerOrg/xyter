// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedData";
// Helpers../../../../../../../helpers/userData
import pluralize from "../../../../../../../helpers/pluralize";
// Models
import fetchUser from "../../../../../../../helpers/userData";
// Handlers

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("give")
      .setDescription("Give credits to a user.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to give credits to.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription(`The amount of credits to give.`)
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure
    const { guild, options } = interaction;

    const discordReceiver = options?.getUser("user");
    const creditAmount = options?.getInteger("amount");

    // If amount option is null
    if (creditAmount === null) {
      throw new Error("You need to provide a credit amount.");
    }

    // If amount is zero or below
    if (creditAmount <= 0) {
      throw new Error("You must provide a credit amount greater than zero");
    }

    if (discordReceiver === null) {
      throw new Error("We could not get the receiving user from Discord");
    }
    if (guild === null) {
      throw new Error("We could not get the current guild from discord.");
    }

    const toUser = await fetchUser(discordReceiver, guild);

    if (toUser === null) {
      throw new Error("The receiving user is not found.");
    }

    if (toUser?.credits === null) {
      throw new Error("The receiving user's credits value could not found.");
    }

    // Deposit amount to toUser
    toUser.credits += creditAmount;

    // Save toUser
    await toUser?.save()?.then(async () => {
      await interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Give)")
            .setDescription(
              `Successfully gave ${pluralize(creditAmount, "credit")}`
            )
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
      return;
    });
  },
};
