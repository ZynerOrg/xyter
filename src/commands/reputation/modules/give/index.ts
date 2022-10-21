import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { command as CooldownCommand } from "../../../../handlers/cooldown";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";
import noSelfReputation from "./components/noSelfReputation";

import prisma from "../../../../handlers/database";

export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("give")
      .setDescription("Give reputation to a user")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you want to repute.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("What type of reputation you want to repute")
          .setRequired(true)
          .addChoices(
            { name: "Positive", value: "positive" },
            {
              name: "Negative",
              value: "negative",
            }
          )
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { options, user, guild } = interaction;

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      guild
    );

    const optionTarget = options?.getUser("target");
    const optionType = options?.getString("type");

    if (!guild) throw new Error("Guild is undefined");
    if (!optionTarget) throw new Error("Target is not defined");

    // Pre-checks
    noSelfReputation(optionTarget, user);

    // Check if user is on cooldown otherwise create one
    await CooldownCommand(
      interaction,
      parseInt(process.env.REPUTATION_TIMEOUT)
    );

    switch (optionType) {
      case "positive": {
        const createUser = await prisma.user.upsert({
          where: {
            id: optionTarget.id,
          },
          update: {
            reputationsEarned: {
              increment: 1,
            },
          },
          create: {
            id: optionTarget.id,
            reputationsEarned: 1,
          },
        });

        logger.silly(createUser);
        break;
      }
      case "negative": {
        const createUser = await prisma.user.upsert({
          where: {
            id: optionTarget.id,
          },
          update: {
            reputationsEarned: {
              decrement: 1,
            },
          },
          create: {
            id: optionTarget.id,
            reputationsEarned: -1,
          },
        });

        logger.silly(createUser);
        break;
      }
      default: {
        throw new Error("Invalid reputation type");
      }
    }

    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:loudspeaker:] Give")
      .setDescription(
        `You have given a ${optionType} repute to ${optionTarget}`
      )
      .setTimestamp()
      .setColor(successColor)
      .setFooter({ text: footerText, iconURL: footerIcon });

    await interaction.editReply({
      embeds: [interactionEmbed],
    });
  },
};
