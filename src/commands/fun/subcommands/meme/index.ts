import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import cooldown from "../../../../middlewares/cooldown";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("meme").setDescription("Random memes from r/memes");
};

export const execute = async (interaction: CommandInteraction) => {
  await deferReply(interaction, false);

  const { guild, user, commandId } = interaction;
  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");

  await cooldown(guild, user, commandId, 15);

  const embedConfig = await getEmbedConfig(guild);

  await axios
    .get("https://www.reddit.com/r/memes/random/.json")
    .then(async (res) => {
      const response = res.data[0].data.children;
      const content = response[0].data;

      const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("View post")
          .setStyle(ButtonStyle.Link)
          .setEmoji("🔗")
          .setURL(`https://reddit.com${content.permalink}`)
      );

      const embed = new EmbedBuilder()
        .setTitle(`😆︱Meme`)
        .setDescription(`**${content.title}**`)
        .setTimestamp(new Date())
        .setImage(content.url)
        .setFooter({
          text: `👍 ${content.ups}︱👎 ${content.downs}`,
        })
        .setColor(embedConfig.successColor);

      await interaction.editReply({ embeds: [embed], components: [buttons] });
      return;
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};
