const { SlashCommandBuilder } = require('@discordjs/builders');

const db = require('quick.db');
const credits = new db.table('credits');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance or view top balance.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('check')
        .setDescription('Check your balance')
        .addUserOption((option) =>
          option
            .setName('user')
            .setDescription('The user whose balance you want to check.')
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) => subcommand.setName('top').setDescription('View top balance')),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommand() === 'check') {
      const user = await interaction.options.getUser('user');

      const amount = await credits.get(user ? user.id : interaction.user.id);
      if (amount) {
        const embed = {
          title: 'Balance',
          description: `${user ? `${user} has` : 'You have'} ${
            amount <= 1 ? `${amount} credit` : `${amount} credits`
          }.`,
          color: 0x22bb33,
          timestamp: new Date(),
          footer: { text: 'Zyner Bot' },
        };
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = {
          title: 'Balance',
          description: `${user} has no credits.`,
          color: 0xbb2124,
          timestamp: new Date(),
          footer: { text: 'Zyner Bot' },
        };
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === 'top') {
      const { client } = interaction;
      const all = credits.all();
      const allSorted = all.sort((a, b) => (a.data > b.data ? -1 : 1));

      const topTen = allSorted.slice(0, 10);

      const topTens = [];

      Promise.all(
        topTen.map(async (x, i) => {
          user = await client.users.fetch(`${x.ID}`, { force: true });
          topTens.push({ index: i, user: user, credits: x.data });
        })
      ).then(async () => {
        const embed = {
          title: 'Balance Top',
          description: `Below are the top ten.\n
          ${topTens
            .map(
              (x) =>
                `**Top ${x.index + 1}** - ${x.user}: ${
                  x.credits <= 1 ? `${x.credits} credit` : `${x.credits} credits`
                }`
            )
            .join('\n')}`,
          color: 0x22bb33,
          timestamp: new Date(),
          footer: { text: 'Zyner Bot' },
        };
        return await interaction.editReply({ embeds: [embed], ephemeral: true });
      });
    }
  },
};
