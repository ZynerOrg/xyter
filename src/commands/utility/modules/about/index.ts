// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
// Configurations
import getEmbedConfig from "../../../../helpers/getEmbedData";

// Function
export default {
  metadata: { guildOnly: false, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("about").setDescription("About this bot!)");
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Source Code")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📄")
        .setURL("https://github.com/ZynerOrg/xyter"),
      new ButtonBuilder()
        .setLabel("Documentation")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📚")
        .setURL("https://xyter.zyner.org"),
      new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setEmoji("🌐")
        .setURL("https://zyner.org"),
      new ButtonBuilder()
        .setLabel("Get Help")
        .setStyle(ButtonStyle.Link)
        .setEmoji("💬")
        .setURL("https://discord.zyner.org"),
      new ButtonBuilder()
        .setLabel(`Hosted by ${process.env.BOT_HOSTER_NAME}`)
        .setStyle(ButtonStyle.Link)
        .setEmoji("⚒️")
        .setURL(`${process.env.BOT_HOSTER_URL}`)
    );

    const interactionEmbed = new EmbedBuilder()
      .setColor(successColor)
      .setTitle("[:tools:] About")
      .setDescription(
        `
**Xyter**'s goal is to provide a __privacy-friendly__ discord bot.
We created **Xyter** to **replace the mess** of having a dozen or so bots in __your__ community.
On top of this, you can also see our **source code** for **security** and **privacy** issues.
As well as making your own **fork** of the bot, you can also get **help** from our community.

Developed with ❤️ by **Zyner**, a non-profit project by teens.
        `
      )
      .setTimestamp()
      .setFooter({ text: footerText, iconURL: footerIcon });

    await interaction.editReply({
      embeds: [interactionEmbed],
      components: [buttons],
    });
  },
};
