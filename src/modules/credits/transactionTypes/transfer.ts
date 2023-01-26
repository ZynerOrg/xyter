import { Guild, User } from "discord.js";
import prisma from "../../../handlers/prisma";
import validateTransaction from "../validateTransaction";

export default async (
  guild: Guild,
  fromUser: User,
  toUser: User,
  amount: number
) => {
  return await prisma.$transaction(async (tx) => {
    const fromTransaction = await tx.guildMemberCredit.upsert({
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
                  create: { id: fromUser.id },
                  where: { id: fromUser.id },
                },
              },
              guild: {
                connectOrCreate: {
                  create: { id: guild.id },
                  where: { id: guild.id },
                },
              },
            },
            where: {
              userId_guildId: { userId: fromUser.id, guildId: guild.id },
            },
          },
        },
        balance: -amount,
      },
      where: {
        userId_guildId: {
          userId: fromUser.id,
          guildId: guild.id,
        },
      },
    });

    if (fromTransaction.balance < 0) {
      throw new Error(`${fromUser} do not have enough credits`);
    }

    if (fromUser.id === toUser.id) {
      throw new Error("You can't transfer credits to yourself");
    }

    const toTransaction = await tx.guildMemberCredit.upsert({
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
                  create: { id: toUser.id },
                  where: { id: toUser.id },
                },
              },
              guild: {
                connectOrCreate: {
                  create: { id: guild.id },
                  where: { id: guild.id },
                },
              },
            },
            where: { userId_guildId: { userId: toUser.id, guildId: guild.id } },
          },
        },
        balance: amount,
      },
      where: {
        userId_guildId: {
          userId: toUser.id,
          guildId: guild.id,
        },
      },
    });

    validateTransaction(guild, fromUser, amount);
    validateTransaction(guild, toUser, amount);

    return { fromTransaction, toTransaction };
  });
};
