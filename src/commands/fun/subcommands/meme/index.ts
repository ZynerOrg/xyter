import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  TextChannel,
} from "discord.js";
import CooldownManager from "../../../../handlers/CooldownManager";
import generateCooldownName from "../../../../helpers/generateCooldownName";
import deferReply from "../../../../utils/deferReply";
import sendResponse from "../../../../utils/sendResponse";

const cooldownManager = new CooldownManager();

interface MemeContent {
  title: string;
  url: string;
  author: string;
  ups: number;
  over_18: boolean;
  permalink: string;
}

interface AuthorData {
  icon_img: string;
  // Add other properties as needed
}

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("meme").setDescription("Random memes from r/memes");
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  await deferReply(interaction, false);

  const { channel, guild, user } = interaction;
  const cooldownItem = await generateCooldownName(interaction);
  const cooldownDuration = 15; // 10 seconds

  try {
    const content: MemeContent = await fetchRandomMeme();
    const authorData: AuthorData = await fetchAuthorData(content.author);

    if (channel instanceof TextChannel && channel.nsfw && content.over_18) {
      // NSFW handling logic (e.g., skip or show a warning message)
      return;
    }

    const buttons = createButtons(content.permalink);
    const embed = createEmbed(content, authorData);

    await sendResponse(interaction, {
      embeds: [embed],
      components: [buttons],
    });
  } catch (error) {
    throw new Error(
      "Sorry, we couldn't fetch a meme at the moment. Please try again later."
    );
  }

  await cooldownManager.setCooldown(
    cooldownItem,
    guild || null,
    user,
    cooldownDuration
  );
};

async function fetchRandomMeme(): Promise<MemeContent> {
  const { data } = await axios.get(
    "https://www.reddit.com/r/memes/random/.json"
  );
  const { children } = data[0].data;
  const content: MemeContent = children[0].data;
  return content;
}

async function fetchAuthorData(author: string): Promise<AuthorData> {
  const { data } = await axios.get(
    `https://www.reddit.com/user/${author}/about.json`
  );
  const authorData: AuthorData = data.data;
  return authorData;
}

function createButtons(permalink: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("View post")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🔗")
      .setURL(`https://reddit.com${permalink}`)
  );
}

function createEmbed(content: MemeContent, authorData: AuthorData) {
  return new EmbedBuilder()
    .setAuthor({ name: content.title })
    .setTimestamp()
    .setImage(content.url)
    .setFooter({
      text: `Meme by ${content.author} | 👍 ${content.ups}`,
      iconURL: authorData.icon_img.split("?").shift(),
    })
    .setColor(process.env.EMBED_COLOR_SUCCESS);
}
