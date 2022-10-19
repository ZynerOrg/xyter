const updateGuildCounter = await prisma.guildCounter.update({
  where: {
    guildId_channelId: {
      guildId: guild.id,
      channelId: channel.id,
    },
  },
  data: {
    count: {
      increment: 1,
    },
  },
});
