// Dependencies
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

// Handlers
import logger from "../../../../../middlewares/logger";

import mongoose from "mongoose";

// Models
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import fetchUser from "../../../../../helpers/fetchUser";

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
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, user, guild, client } = interaction;

    const optionUser = options.getUser("user");
    const optionAmount = options.getInteger("amount");
    const optionReason = options.getString("reason");

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Gift")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (guild === null) {
      logger.silly(`Guild is null`);

      return interaction.editReply({
        embeds: [
          embed.setDescription("Guild is not found").setColor(errorColor),
        ],
      });
    }

    if (optionUser === null) {
      logger.silly(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(`User is not found in this guild`)
            .setColor(errorColor),
        ],
      });
    }

    // Get fromUserDB object
    const fromUserDB = await fetchUser(user, guild);

    // Get toUserDB object
    const toUserDB = await fetchUser(optionUser, guild);

    if (fromUserDB === null) {
      logger.silly(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "You do not have any credits. Please write something in the chat to get some."
            )
            .setColor(errorColor),
        ],
      });
    }

    if (toUserDB === null) {
      logger.silly(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "The user you want to gift credits to does not have any credits. Please wait until that user has typed something in the chat to get some."
            )
            .setColor(errorColor),
        ],
      });
    }

    // If receiver is same as sender
    if (optionUser.id === user.id) {
      logger.silly(`User is same as sender`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "You can't gift credits to yourself. Please choose a different user."
            )
            .setColor(errorColor),
        ],
      });
    }

    // If amount is null
    if (optionAmount === null) {
      logger.silly(`Amount is null`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "Please specify the amount of credits you want to gift."
            )
            .setColor(errorColor),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      logger.silly(`Amount is zero or below`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "Please specify a valid amount of credits you want to gift."
            )
            .setColor(errorColor),
        ],
      });
    }

    // If user has below gifting amount
    if (fromUserDB.credits < optionAmount) {
      logger.silly(`User has below gifting amount`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "You don't have enough credits to gift that amount. Please try again with a lower amount."
            )
            .setColor(errorColor),
        ],
      });
    }

    // If toUserDB has no credits
    if (toUserDB === null) {
      logger.silly(`User has no credits`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "The user you want to gift credits to does not have any credits. Please wait until that user has typed something in the chat to get some."
            )
            .setColor(errorColor),
        ],
      });
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      // Withdraw amount from fromUserDB
      fromUserDB.credits -= optionAmount;

      // Deposit amount to toUserDB
      toUserDB.credits += optionAmount;

      await fromUserDB.save();

      await toUserDB.save();

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`${error}`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "An error occurred while trying to gift credits. Please try again."
            )
            .setColor(errorColor),
        ],
      });
    } finally {
      // ending the session
      session.endSession();
    }

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
            `Successfully gifted ${optionAmount} credits to ${
              optionUser.tag
            } with reason: ${optionReason || "unspecified"}`
          )
          .setColor(successColor),
      ],
    });
  },
};
