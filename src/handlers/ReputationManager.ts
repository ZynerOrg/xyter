import { User } from "discord.js";
import prisma from "./prisma";

class ReputationManager {
  async check(user: User) {
    const userData = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        userReputation: {
          create: {
            positive: 0,
            negative: 0,
          },
        },
      },
      include: {
        userReputation: true,
      },
    });

    const userReputation = userData.userReputation;

    if (!userReputation) {
      return {
        total: 0,
        positive: 0,
        negative: 0,
      };
    }

    return {
      total: userReputation.positive - userReputation.negative,
      positive: userReputation.positive,
      negative: userReputation.negative,
    };
  }

  async repute(user: User, type: "positive" | "negative") {
    const userData = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        userReputation: {
          create: {
            positive: 0,
            negative: 0,
          },
        },
      },
      include: {
        userReputation: true,
      },
    });

    let userReputation: any = {};

    if (!userData.userReputation) return null;

    if (type === "positive") {
      userReputation = await prisma.userReputation.upsert({
        where: { id: userData.userReputation.id },
        update: { positive: { increment: 1 } },
        create: {
          positive: 1,
          negative: 0,
          user: { connect: { id: user.id } },
        },
      });
    }

    if (type === "negative") {
      userReputation = await prisma.userReputation.upsert({
        where: { id: userData.userReputation.id },
        update: { negative: { increment: 1 } },
        create: {
          positive: 0,
          negative: 1,
          user: { connect: { id: user.id } },
        },
      });
    }

    return userReputation;
  }
}

export default ReputationManager;
