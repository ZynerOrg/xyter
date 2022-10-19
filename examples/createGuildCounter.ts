const createGuildCounter = await prisma.guildCounter.upsert({
  where: {
    guildId_channelId: {
      guildId: guild.id,
      channelId: discordChannel.id,
    },
  },
  update: {},
  create: {
    channelId: discordChannel.id,
    triggerWord,
    count: startValue || 0,
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
  },
});
