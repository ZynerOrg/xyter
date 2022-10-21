const userId = "SNOWFLKAE";
const guildId = "SNOWFLAKE";

const createGuildMember = await prisma.guildMember.upsert({
  where: {
    userId_guildId: {
      userId,
      guildId,
    },
  },
  update: {},
  create: {
    user: {
      connectOrCreate: {
        create: {
          id: userId,
        },
        where: {
          id: userId,
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
  include: {
    user: true,
    guild: true,
  },
});

console.log(createGuildMember);
