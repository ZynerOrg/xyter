import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import getEmbedConfig from "../../../../../helpers/getEmbedData";
import counterSchema from "../../../../../models/counter";

export default {
  metadata: { guildOnly: true, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription(`View a guild counter`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            `The channel that contains the counter you want to view`
          )
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },

  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const discordChannel = options.getChannel("channel");

    if (!guild) throw new Error(`Guild not found`);
    if (!discordChannel) throw new Error(`Channel not found`);

    const embed = new EmbedBuilder()
      .setTitle("[:1234:] Counters (View)")
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    const counter = await counterSchema.findOne({
      guildId: guild.id,
      channelId: discordChannel.id,
    });

    const counters = await counterSchema.find();

    console.log(counters, {
      guildId: guild.id,
      channelId: discordChannel.id,
    });

    if (!counter) throw new Error("No counter found for channel");

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `Viewing counter for channel ${discordChannel}: ${counter.counter}!`
          )
          .setColor(successColor),
      ],
    });
  },
};
