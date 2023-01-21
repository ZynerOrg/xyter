import { Guild, User } from "discord.js";
import prisma from "../../handlers/database";
import transactionRules from "./transactionRules";

export default async (guild: Guild, from: User, to: User, amount: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const sender = await tx.guildMemberCredit.upsert({
      update: {
        balance: {
          decrement: amount,
        },
      },
      create: {
        GuildMember: {
          connectOrCreate: {
            create: {
              user: {
                connectOrCreate: {
                  create: { id: from.id },
                  where: { id: from.id },
                },
              },
              guild: {
                connectOrCreate: {
                  create: { id: guild.id },
                  where: { id: guild.id },
                },
              },
            },
            where: { userId_guildId: { userId: from.id, guildId: guild.id } },
          },
        },
        balance: -amount,
      },
      where: {
        userId_guildId: {
          userId: from.id,
          guildId: guild.id,
        },
      },
    });

    // 4. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`);
    }

    // 5. Check if the transactions is valid.
    transactionRules(guild, from, amount);
    transactionRules(guild, to, amount);

    // 6. Verify that sender and recipient are not the same user.
    if (from.id === to.id) throw new Error("You can't transfer to yourself.");

    // 7. Increment the recipient's balance by amount.
    const recipient = await tx.guildMemberCredit.upsert({
      update: {
        balance: {
          increment: amount,
        },
      },
      create: {
        GuildMember: {
          connectOrCreate: {
            create: {
              user: {
                connectOrCreate: {
                  create: { id: to.id },
                  where: { id: to.id },
                },
              },
              guild: {
                connectOrCreate: {
                  create: { id: guild.id },
                  where: { id: guild.id },
                },
              },
            },
            where: { userId_guildId: { userId: to.id, guildId: guild.id } },
          },
        },
        balance: amount,
      },
      where: {
        userId_guildId: {
          userId: to.id,
          guildId: guild.id,
        },
      },
    });

    return recipient;
  });
};
