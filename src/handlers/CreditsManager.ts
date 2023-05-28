import { Guild, User } from "discord.js";
import logger from "../utils/logger";
import prisma from "./prisma";

class CreditsManager {
  async validateTransaction(guild: Guild, user: User, amount: number) {
    if (!guild) {
      throw new Error("Credits are only available for guilds.");
    }

    if (amount <= 0) {
      throw new Error("You cannot make a transaction below 1 credit.");
    }

    if (amount > 2147483647) {
      throw new Error("The maximum allowed credits is 2,147,483,647.");
    }

    if (user.bot) {
      throw new Error("Bots cannot participate in transactions.");
    }
  }

  async balance(guild: Guild, user: User) {
    return await prisma.$transaction(async (tx) => {
      const recipient = await tx.guildMemberCredit.upsert({
        update: {},
        create: {
          guildMember: {
            connectOrCreate: {
              create: {
                user: {
                  connectOrCreate: {
                    create: { id: user.id },
                    where: { id: user.id },
                  },
                },
                guild: {
                  connectOrCreate: {
                    create: { id: guild.id },
                    where: { id: guild.id },
                  },
                },
              },
              where: { guildId_userId: { guildId: guild.id, userId: user.id } },
            },
          },
        },
        where: {
          guildId_userId: {
            guildId: guild.id,
            userId: user.id,
          },
        },
      });

      if (!recipient) throw new Error("No recipient available");

      return recipient;
    });
  }

  async give(guild: Guild, user: User, amount: number) {
    try {
      logger.debug(
        `Starting give transaction for guild: ${guild.id}, user: ${user.id}`
      );

      const recipient = await prisma.$transaction(async (tx) => {
        await this.validateTransaction(guild, user, amount);

        const existingRecipient = await tx.guildMemberCredit.findUnique({
          where: {
            guildId_userId: {
              userId: user.id,
              guildId: guild.id,
            },
          },
        });

        if (existingRecipient && existingRecipient.balance > 2147483647) {
          throw new Error(
            "Oops! That's more credits than the user can have. The maximum allowed is 2,147,483,647."
          );
        }

        await this.upsertGuildMember(guild, user);

        const recipient = await tx.guildMemberCredit.upsert({
          update: {
            balance: {
              increment: amount,
            },
          },
          create: {
            guildMember: {
              connectOrCreate: {
                create: {
                  user: {
                    connectOrCreate: {
                      create: { id: user.id },
                      where: { id: user.id },
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
                  guildId_userId: {
                    guildId: guild.id,
                    userId: user.id,
                  },
                },
              },
            },
            balance: amount,
          },
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: user.id,
            },
          },
        });

        return recipient;
      });

      logger.debug(
        `Give transaction completed for guild: ${guild.id}, user: ${user.id}`
      );

      return recipient;
    } catch (error) {
      logger.error(`Error in give transaction for user: ${user.id}`, error);
      throw error;
    }
  }

  async take(guild: Guild, user: User, amount: number) {
    try {
      logger.debug(
        `Starting take transaction for guild: ${guild.id}, user: ${user.id}`
      );

      const recipient = await prisma.$transaction(async (tx) => {
        await this.validateTransaction(guild, user, amount);

        const existingRecipient = await tx.guildMemberCredit.findUnique({
          where: {
            guildId_userId: {
              userId: user.id,
              guildId: guild.id,
            },
          },
        });

        if (!existingRecipient || existingRecipient.balance < amount) {
          throw new Error("Insufficient credits for the transaction.");
        }

        await this.upsertGuildMember(guild, user);

        const recipient = await tx.guildMemberCredit.upsert({
          update: {
            balance: {
              decrement: amount,
            },
          },
          create: {
            guildMember: {
              connectOrCreate: {
                create: {
                  user: {
                    connectOrCreate: {
                      create: { id: user.id },
                      where: { id: user.id },
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
                  guildId_userId: {
                    guildId: guild.id,
                    userId: user.id,
                  },
                },
              },
            },
            balance: -amount,
          },
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: user.id,
            },
          },
        });

        return recipient;
      });

      logger.debug(
        `Take transaction completed for guild: ${guild.id}, user: ${user.id}`
      );

      return recipient;
    } catch (error) {
      logger.error(`Error in take transaction for user: ${user.id}`, error);
      throw error;
    }
  }

  async set(guild: Guild, user: User, amount: number) {
    try {
      logger.debug(
        `Starting set transaction for guild: ${guild.id}, user: ${user.id}`
      );

      const recipient = await prisma.$transaction(async (tx) => {
        await this.validateTransaction(guild, user, amount);

        await this.upsertGuildMember(guild, user);

        const recipient = await tx.guildMemberCredit.upsert({
          update: {
            balance: amount,
          },
          create: {
            guildMember: {
              connectOrCreate: {
                create: {
                  user: {
                    connectOrCreate: {
                      create: { id: user.id },
                      where: { id: user.id },
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
                  guildId_userId: {
                    guildId: guild.id,
                    userId: user.id,
                  },
                },
              },
            },
            balance: amount,
          },
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: user.id,
            },
          },
        });

        return recipient;
      });

      logger.debug(
        `Set transaction completed for guild: ${guild.id}, user: ${user.id}`
      );

      return recipient;
    } catch (error) {
      logger.error(`Error in set transaction for user: ${user.id}`, error);
      throw error;
    }
  }

  async transfer(guild: Guild, fromUser: User, toUser: User, amount: number) {
    if (fromUser.id === toUser.id) {
      throw new Error("The sender and receiver cannot be the same user.");
    }

    try {
      const fromTransaction = await prisma.guildMemberCredit.findFirst({
        where: {
          guildId: guild.id,
          userId: fromUser.id,
        },
      });

      if (!fromTransaction) {
        throw new Error("Failed to fetch the sender's transaction record.");
      }

      const toTransaction = await prisma.guildMemberCredit.findUnique({
        where: {
          guildId_userId: {
            guildId: guild.id,
            userId: toUser.id,
          },
        },
      });

      if (!toTransaction) {
        console.log({ guildId: guild.id, userId: toUser.id });

        // Create a new transaction record for the recipient with initial balance of 0

        await this.upsertGuildMember(guild, toUser);
        prisma.guildMemberCredit.create({
          data: {
            guildId: guild.id,
            userId: toUser.id,
            balance: 0,
          },
        });
      }

      const remainingBalance = 2147483647 - amount;

      if (fromTransaction.balance < amount) {
        throw new Error("The sender does not have enough credits.");
      }

      await this.validateTransaction(guild, toUser, amount);

      let adjustedAmount = amount;
      let overflowAmount = 0;

      if (toTransaction && toTransaction.balance + amount > 2147483647) {
        adjustedAmount = 2147483647 - toTransaction.balance;
        overflowAmount = amount - adjustedAmount;
      }

      await prisma.$transaction(async (tx) => {
        await tx.guildMemberCredit.update({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: fromUser.id,
            },
          },
          data: {
            balance: {
              decrement: amount,
            },
          },
        });

        if (adjustedAmount > 0) {
          await tx.guildMemberCredit.upsert({
            where: {
              guildId_userId: {
                guildId: guild.id,
                userId: toUser.id,
              },
            },
            create: {
              guildId: guild.id,
              userId: toUser.id,
              balance: adjustedAmount,
            },
            update: {
              balance: {
                increment: adjustedAmount,
              },
            },
          });
        }

        if (overflowAmount > 0) {
          await tx.guildMemberCredit.update({
            where: {
              guildId_userId: {
                guildId: guild.id,
                userId: fromUser.id,
              },
            },
            data: {
              balance: {
                increment: overflowAmount,
              },
            },
          });
        }
      });

      const updatedFromTransaction = await prisma.guildMemberCredit.findFirst({
        where: {
          guildId: guild.id,
          userId: fromUser.id,
        },
      });

      const updatedToTransaction = await prisma.guildMemberCredit.findFirst({
        where: {
          guildId: guild.id,
          userId: toUser.id,
        },
      });

      if (!updatedFromTransaction) {
        throw new Error(
          "Failed to fetch the updated sender's transaction record."
        );
      }

      if (!updatedToTransaction) {
        throw new Error(
          "Failed to fetch the updated recipient's transaction record."
        );
      }

      const transferredAmount = adjustedAmount;

      return {
        transferredAmount,
        fromTransaction: updatedFromTransaction,
        toTransaction: updatedToTransaction,
      };
    } catch (error: any) {
      logger.error(
        `Error in transaction for guild: ${guild.id}, sender: ${fromUser.id}, recipient: ${toUser.id}: ${error.message}`
      );
      throw error;
    }
  }

  async topUsers(guild: Guild, userAmount: number) {
    return await prisma.$transaction(async (tx) => {
      const topUsers = await prisma.guildMemberCredit.findMany({
        where: {
          guildId: guild.id,
        },
        orderBy: {
          balance: "desc",
        },
        take: userAmount,
      });

      // 2. Verify that there are some top users.
      if (!topUsers) throw new Error("No top users found");

      // 3. Return top users.
      return topUsers;
    });
  }

  async upsertGuildMember(guild: Guild, user: User) {
    await prisma.guildMember.upsert({
      update: {},
      create: {
        user: {
          connectOrCreate: {
            create: { id: user.id },
            where: { id: user.id },
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
        guildId_userId: {
          guildId: guild.id,
          userId: user.id,
        },
      },
    });
  }
}

export default CreditsManager;
