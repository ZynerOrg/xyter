const userId = "SNOWFLAKE";
const guildId = "SNOWFLAKE";

const deleteGuildMember = await prisma.guildMember.deleteMany({
  where: {
    userId,
    guildId,
  },
});

console.log(deleteGuildMember);
