import { Guild, User } from "discord.js";
import prisma from "../../handlers/database";
import transactionRules from "./transactionRules";

export default async (guild: Guild, user: User, amount: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Check if the transaction is valid.
    transactionRules(guild, user, amount);

    // 2. Make the transaction.
    const recipient = await tx.guildMemberCredits.upsert({
      update: {
        balance: {
          decrement: amount,
        },
      },
      create: {
        GuildMember: {
          connectOrCreate: {
            create: {
              userId: user.id,
              guildId: guild.id,
            },
            where: {
              userId_guildId: {
                userId: user.id,
                guildId: guild.id,
              },
            },
          },
        },
        balance: -amount,
      },
      where: {
        userId_guildId: {
          userId: user.id,
          guildId: guild.id,
        },
      },
    });

    // 3. Verify that the recipient credits are not below zero.
    if (recipient.balance < -100)
      throw new Error("User do not have enough credits");

    // 4. Return the recipient.
    return recipient;
  });
};
