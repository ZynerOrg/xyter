import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import getEmbedConfig from "../../../helpers/getEmbedConfig";

import prisma from "../../../handlers/prisma";
import deferReply from "../../../helpers/deferReply";
import cooldown from "../../../middlewares/cooldown";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("repute")
    .setDescription("Repute a user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you repute")
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
  const { options, user, guild, commandId } = interaction;
  await deferReply(interaction, true);
  if (!guild) throw new Error("This command can only be used in guilds");

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const reputationUser = options.getUser("user");
  const reputationType = options.getString("type");

  if (!reputationUser) {
    throw new Error(
      "Sorry, we were unable to find the user you are trying to give reputation to."
    );
  }

  if (user.id === reputationUser.id) {
    throw new Error("It is not possible to give yourself reputation.");
  }

  await cooldown(
    guild,
    user,
    commandId,
    parseInt(process.env.REPUTATION_TIMEOUT)
  );

  switch (reputationType) {
    case "positive": {
      await prisma.user.upsert({
        where: {
          id: reputationUser.id,
        },
        update: {
          reputationsEarned: {
            increment: 1,
          },
        },
        create: {
          id: reputationUser.id,
          reputationsEarned: 1,
        },
      });
      break;
    }
    case "negative": {
      await prisma.user.upsert({
        where: {
          id: reputationUser.id,
        },
        update: {
          reputationsEarned: {
            decrement: 1,
          },
        },
        create: {
          id: reputationUser.id,
          reputationsEarned: -1,
        },
      });
      break;
    }
    default: {
      throw new Error("Invalid reputation type");
    }
  }

  const interactionEmbed = new EmbedBuilder()
    .setTitle(`:loudspeaker:︱Reputing ${reputationUser.tag}`)
    .setDescription(
      `You have successfully given a ${reputationType} reputation to ${reputationUser}!`
    )
    .setTimestamp()
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon });

  await interaction.editReply({
    embeds: [interactionEmbed],
  });
};
