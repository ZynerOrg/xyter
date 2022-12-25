import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";

import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";
import creditsTransfer from "../../../../helpers/credits/transfer";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
import logger from "../../../../middlewares/logger";

// 1. Export a builder function.
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("gift")
    .setDescription(`Gift credits to an account`)
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription("The account you gift to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("credits")
        .setDescription("How much you gift")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100000000)
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Your personalized message to the account")
    );
};

// 2. Export an execute function.
export const execute = async (interaction: ChatInputCommandInteraction) => {
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Destructure interaction object.
  const { options, user, guild } = interaction;
  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");

  // 3. Get options from interaction.
  const account = options.getUser("account");
  const credits = options.getInteger("credits");
  const message = options.getString("message");
  if (!account) throw new Error("Account unavailable");
  if (typeof credits !== "number")
    throw new Error("You need to enter a valid number of credits to gift");

  // 4. Create base embeds.
  const receiverEmbed = await BaseEmbedSuccess(
    guild,
    `:credit_card:︱You received a gift from ${user.username}`
  );

  await upsertGuildMember(guild, user);

  // 5. Start an transaction of the credits.
  await creditsTransfer(guild, user, account, credits);

  const receiverGuildMember = await prisma.guildMemberCredit.upsert({
    where: {
      userId_guildId: {
        userId: account.id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      GuildMember: {
        connectOrCreate: {
          create: {
            userId: account.id,
            guildId: guild.id,
          },
          where: {
            userId_guildId: {
              userId: account.id,
              guildId: guild.id,
            },
          },
        },
      },
    },
    include: {
      GuildMember: true,
    },
  });
  logger.silly(receiverGuildMember);

  if (message) receiverEmbed.setFields({ name: "Message", value: message });

  // 6. Tell the target that they have been gifted credits.
  await account.send({
    embeds: [
      receiverEmbed.setDescription(
        `You received a gift containing ${credits} coins from ${user}! You now have ${receiverGuildMember.balance} coins in balance!`
      ),
    ],
  });

  const senderGuildMember = await prisma.guildMemberCredit.upsert({
    where: {
      userId_guildId: {
        userId: user.id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      GuildMember: {
        connectOrCreate: {
          create: {
            userId: account.id,
            guildId: guild.id,
          },
          where: {
            userId_guildId: {
              userId: account.id,
              guildId: guild.id,
            },
          },
        },
      },
    },
    include: {
      GuildMember: true,
    },
  });
  logger.silly(senderGuildMember);

  const senderEmbed = await BaseEmbedSuccess(
    guild,
    ":credit_card:︱Send a gift"
  );

  if (message) senderEmbed.setFields({ name: "Message", value: message });

  // 7. Tell the sender that they have gifted the credits.
  await interaction.editReply({
    embeds: [
      senderEmbed.setDescription(
        `Your gift has been sent to ${account}. You now have ${senderGuildMember.balance} coins in balance!`
      ),
    ],
  });
};
