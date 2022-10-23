import { Guild, User } from "discord.js";
import prisma from "../../handlers/database";

// Start an transaction between two users in a guild.
export const transfer = async (
  guild: Guild,
  from: User,
  to: User,
  amount: number
) => {
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

    // 2. Verify that the sender actually is created.
    if (!sender) throw new Error("No sender available");

    // 3. Verify that the sender's balance exists.
    if (!sender.creditsEarned) throw new Error("No credits available");

    // 4. Verify that the sender's balance didn't go below zero.
    if (sender.creditsEarned < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`);
    }

    // 5. Verify that the sender is not trying to send less that one credits.
    if (amount <= 0) {
      throw new Error("You can't transfer below one credit.");
    }

    // 6. Verify that the sender is not trying to send more than 100.000.000 credits.
    if (amount > 100000000) {
      throw new Error("You can't transfer more than 100.000.000 credits.");
    }

    // 7. Verify that recipient are not an bot.
    if (to.bot) throw new Error("You can't transfer to an bot.");

    // 8. Verify that sender and recipient are not the same user.
    if (from.id === to.id) throw new Error("You can't transfer to yourself.");

    // 9. Increment the recipient's balance by amount.
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
        creditsEarned: amount,
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
