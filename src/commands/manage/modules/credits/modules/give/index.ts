// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import logger from "../../../../../../middlewares/logger";
// Configurations
import getEmbedConfig from "../../../../../../helpers/getEmbedData";
// Helpers../../../../../../../helpers/userData
import pluralize from "../../../../../../helpers/pluralize";
// Models
// Handlers
import prisma from "../../../../../../handlers/database";
import deferReply from "../../../../../../handlers/deferReply";
import checkPermission from "../../../../../../helpers/checkPermission";
// Function
export default {
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
    await deferReply(interaction, true);

    await checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure
    const { guild, options } = interaction;

    const discordReceiver = options?.getUser("user");
    const creditAmount = options?.getInteger("amount");

    // If amount option is null
    if (creditAmount === null)
      throw new Error("You need to provide a credit amount.");

    // If amount is zero or below
    if (creditAmount <= 0)
      throw new Error("You must provide a credit amount greater than zero");

    if (discordReceiver === null)
      throw new Error("We could not get the receiving user from Discord");

    if (guild === null)
      throw new Error("We could not get the current guild from discord.");

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: discordReceiver.id,
          guildId: guild.id,
        },
      },
      update: { creditsEarned: { increment: creditAmount } },
      create: {
        creditsEarned: creditAmount,
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

    // Save toUser
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
  },
};
