const getGuildMember = await prisma.guildMember.findUnique({
  where: {
    userId_guildId: {
      userId: author.id,
      guildId: guild.id,
    },
  },
  include: {
    guild: true,
  },
});
