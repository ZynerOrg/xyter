import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";
import noSelfReputation from "./components/noSelfReputation";

import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import cooldown from "../../../../middlewares/cooldown";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("repute")
    .setDescription("Repute an account")
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription("The account you repute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of reputation")
        .setRequired(true)
        .addChoices(
          { name: "Positive", value: "positive" },
          {
            name: "Negative",
            value: "negative",
          }
        )
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  const { options, user, guild, commandId } = interaction;

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const optionAccount = options?.getUser("account");
  const optionType = options?.getString("type");

  if (!guild) throw new Error("Server unavailable");
  if (!optionAccount) throw new Error("User unavailable");

  // Pre-checks
  noSelfReputation(optionAccount, user);

  // Check if user is on cooldown otherwise create one
  await cooldown(
    guild,
    user,
    commandId,
    parseInt(process.env.REPUTATION_TIMEOUT)
  );

  switch (optionType) {
    case "positive": {
      const createUser = await prisma.user.upsert({
        where: {
          id: optionAccount.id,
        },
        update: {
          reputationsEarned: {
            increment: 1,
          },
        },
        create: {
          id: optionAccount.id,
          reputationsEarned: 1,
        },
      });

      logger.silly(createUser);
      break;
    }
    case "negative": {
      const createUser = await prisma.user.upsert({
        where: {
          id: optionAccount.id,
        },
        update: {
          reputationsEarned: {
            decrement: 1,
          },
        },
        create: {
          id: optionAccount.id,
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
    .setTitle(`:loudspeaker:︱Reputing ${optionAccount.username}`)
    .setDescription(
      `You have given a ${optionType} repute to ${optionAccount}!`
    )
    .setTimestamp()
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon });

  await interaction.editReply({
    embeds: [interactionEmbed],
  });
};
