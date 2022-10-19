// Dependencies
// Models
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
// Handlers
import prisma from "../../../../../../../handlers/database";
import logger from "../../../../../../../middlewares/logger";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("take")
      .setDescription("Take credits from a user.")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user to take credits from.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription(`The amount of credits to take.`)
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild); // Destructure
    const { guild, options } = interaction;

    // User option
    const discordReceiver = options?.getUser("user");

    // Amount option
    const optionAmount = options?.getInteger("amount");

    // If amount is null
    if (optionAmount === null) {
      logger?.silly(`Amount is null`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must provide an amount.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      logger?.silly(`Amount is zero or below`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must provide an amount greater than zero.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (discordReceiver === null) {
      logger?.silly(`Discord receiver is null`);

      return interaction?.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must provide a user.`)
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
            .setTitle("[:toolbox:] Manage - Credits (Take)")
            .setDescription(`You must be in a guild.`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: discordReceiver.id,
          guildId: guild.id,
        },
      },
      update: { creditsEarned: { decrement: optionAmount } },
      create: {
        creditsEarned: -optionAmount,
        user: {
          connectOrCreate: {
            create: {
              id: discordReceiver.id,
            },
            where: {
              id: discordReceiver.id,
            },
          },
        },
        guild: {
          connectOrCreate: {
            create: {
              id: guild.id,
            },
            where: {
              id: guild.id,
            },
          },
        },
      },
    });

    logger.silly(createGuildMember);
    await interaction?.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("[:toolbox:] Manage - Credits (Take)")
          .setDescription(
            `Took ${pluralize(optionAmount, "credit")} from ${discordReceiver}.`
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
    return;
  },
};
