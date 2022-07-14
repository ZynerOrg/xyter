// Dependencies
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

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

    const buttons = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Source Code")
        .setStyle("LINK")
        .setEmoji("📄")
        .setURL("https://github.com/ZynerOrg/xyter"),
      new MessageButton()
        .setLabel("Documentation")
        .setStyle("LINK")
        .setEmoji("📚")
        .setURL("https://xyter.zyner.org"),
      new MessageButton()
        .setLabel("Website")
        .setStyle("LINK")
        .setEmoji("🌐")
        .setURL("https://zyner.org"),
      new MessageButton()
        .setLabel("Get Help")
        .setStyle("LINK")
        .setEmoji("💬")
        .setURL("https://discord.zyner.org"),
      new MessageButton()
        .setLabel(`Hosted by ${process.env.BOT_HOSTER_NAME}`)
        .setStyle("LINK")
        .setEmoji("⚒️")
        .setURL(`${process.env.BOT_HOSTER_URL}`)
    );

    const interactionEmbed = {
      title: "[:tools:] About",
      description: `
      **Xyter**'s goal is to provide a __privacy-friendly__ discord bot.
      We created **Xyter** to **replace the mess** of having a dozen or so bots in __your__ community.
      On top of this, you can also see our **source code** for **security** and **privacy** issues.
      As well as making your own **fork** of the bot, you can also get **help** from our community.

      Developed with ❤️ by **Zyner**, a non-profit project by teens.
      `,
      color: successColor,
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };
    await interaction.editReply({
      embeds: [interactionEmbed],
      components: [buttons],
    });
  },
};
