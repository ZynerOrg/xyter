import { Guild, User } from "discord.js";
import prisma from "../prisma";

export default async (guild: Guild, from: User, to: User, amount: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const sender = await tx.guildMember.upsert({
      update: {
        creditsEarned: {
          decrement: amount,
        },
      },
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: from.id,
            },
            where: {
              id: from.id,
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
        creditsEarned: -amount,
      },
      where: {
        userId_guildId: {
          userId: from.id,
          guildId: guild.id,
        },
      },
    });

    if (!sender) throw new Error("No sender available");

    if (!sender.creditsEarned) throw new Error("No credits available");

    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.creditsEarned < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`);
    }

    // 3. Increment the recipient's balance by amount
    const recipient = await tx.guildMember.upsert({
      update: {
        creditsEarned: {
          increment: amount,
        },
      },
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: to.id,
            },
            where: {
              id: to.id,
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
        creditsEarned: +amount,
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
