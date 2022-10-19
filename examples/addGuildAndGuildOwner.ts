const ownerId = "SNOWFLAKE";
const guildId = "SNOWFLAKE";

// Create guildMember object
const createGuildMember = await prisma.guildMember.upsert({
  where: {
    userId_guildId: {
      userId: ownerId,
      guildId,
    },
  },
  update: {},
  create: {
    user: {
      connectOrCreate: {
        create: {
          id: ownerId,
        },
        where: {
          id: ownerId,
        },
      },
    },
    guild: {
      connectOrCreate: {
        create: {
          id: guildId,
        },
        where: {
          id: guildId,
        },
      },
    },
  },
});

logger.silly(createGuildMember);
