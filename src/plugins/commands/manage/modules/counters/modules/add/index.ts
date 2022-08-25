// Dependencies
import {
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
} from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";

import logger from "../../../../../../../middlewares/logger";

// Models
import counterSchema from "../../../../../../../models/counter";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("add")
      .setDescription("Add a counter to your guild.")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to send the counter to.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addStringOption((option) =>
        option
          .setName("word")
          .setDescription("The word to use for the counter.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("start")
          .setDescription("The starting value of the counter.")
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");
    const countingWord = options?.getString("word");
    const startValue = options?.getNumber("start");

    const embed = new EmbedBuilder()
      .setTitle("[:toolbox:] Counters - Add")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter) {
      return interaction?.editReply({
        embeds: [
          embed
            .setDescription(`A counter already exists for this channel.`)
            .setColor(errorColor),
        ],
      });
    }

    await counterSchema
      ?.create({
        guildId: guild?.id,
        channelId: discordChannel?.id,
        word: countingWord,
        counter: startValue || 0,
      })
      .then(async () => {
        logger?.silly(`Created counter`);

        return interaction?.editReply({
          embeds: [
            embed
              .setDescription(
                `Successfully created counter for ${discordChannel?.name}.`
              )
              .setColor(successColor),
          ],
        });
      });
  },
};
