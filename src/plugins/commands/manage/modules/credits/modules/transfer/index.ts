// Dependencies
import {
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
  Permissions,
  PermissionsBitField,
} from "discord.js";

import mongoose from "mongoose";

// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";

// Handlers
import logger from "../../../../../../../middlewares/logger";

// Models
import fetchUser from "../../../../../../../helpers/fetchUser";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("transfer")
      .setDescription("Transfer credits from one user to another.")
      .addUserOption((option) =>
        option
          .setName("from")
          .setDescription("The user to transfer credits from.")
          .setRequired(true)
      )
      .addUserOption((option) =>
        option
          .setName("to")
          .setDescription("The user to transfer credits to.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription(`The amount of credits to transfer.`)
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild); // Destructure member
    const { guild, options } = interaction;

    // Get options
    const optionFromUser = options?.getUser("from");
    const optionToUser = options?.getUser("to");
    const optionAmount = options?.getInteger("amount");

    // If amount is null
    if (optionAmount === null) {
      logger?.silly(`Amount is null`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`You must provide an amount.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (guild === null) {
      logger?.silly(`Guild is null`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`You must be in a guild.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    if (optionFromUser === null) {
      logger?.silly(`From user is null`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`You must provide a user to transfer from.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    if (optionToUser === null) {
      logger?.silly(`To user is null`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(`You must provide a user to transfer to.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Get fromUser object
    const fromUser = await fetchUser(optionFromUser, guild);

    // Get toUser object
    const toUser = await fetchUser(optionToUser, guild);

    // If toUser does not exist
    if (fromUser === null) {
      logger?.silly(`From user does not exist`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `The user you provided to transfer from does not exist.`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser.credits does not exist
    if (!fromUser?.credits) {
      logger?.silly(`From user does not have credits`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `The user you provided to transfer from does not have credits.`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser does not exist
    if (toUser === null) {
      logger?.silly(`To user does not exist`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `The user you provided to transfer to does not exist.`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toUser.credits does not exist
    if (toUser?.credits === null) {
      logger?.silly(`To user does not have credits`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              `The user you provided to transfer to does not have credits.`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      // Withdraw amount from fromUserDB
      fromUser.credits -= optionAmount;

      // Deposit amount to toUserDB
      toUser.credits += optionAmount;

      await fromUser.save();

      await toUser.save();

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`${error}`);

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Transfer)")
            .setDescription(
              "An error occurred while trying to gift credits. Please try again."
            )
            .setColor(errorColor)
            .setTimestamp(new Date())
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    } finally {
      // ending the session
      session.endSession();
    }

    return interaction?.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("[:toolbox:] Manage - Credits (Transfer)")
          .setDescription(`Transferred ${optionAmount} credits.`)
          .addFields(
            {
              name: `${optionFromUser?.username} Balance`,
              value: `${fromUser?.credits}`,
              inline: true,
            },
            {
              name: `${optionToUser?.username} Balance`,
              value: `${toUser?.credits}`,
              inline: true,
            }
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  },
};
