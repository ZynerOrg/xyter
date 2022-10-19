const channelCounter = await prisma.guildCounter.findUnique({
  where: {
    guildId_channelId: {
      guildId: guild.id,
      channelId: discordChannel.id,
    },
  },
});
