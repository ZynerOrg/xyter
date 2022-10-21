const deleteGuildCounter = await prisma.guildCounter.deleteMany({
  where: {
    guildId: guild.id,
    channelId: discordChannel.id,
  },
});
