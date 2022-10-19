const guildId = "SNOWFLAKE";

// Delete guildMember objects
const deleteGuildMembers = prisma.guildMember.deleteMany({
  where: {
    guildId,
  },
});

// Delete guild object
const deleteGuild = prisma.guild.deleteMany({
  where: {
    id: guildId,
  },
});

// The transaction runs synchronously so deleteUsers must run last.
await prisma.$transaction([deleteGuildMembers, deleteGuild]);
