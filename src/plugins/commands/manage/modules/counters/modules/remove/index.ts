// Dependencies
// Models
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedData";
// Handlers
import logger from "../../../../../../../middlewares/logger";
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
      .setName("remove")
      .setDescription(`Delete a counter from your guild.`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to delete the counter from.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");

    const embed = new EmbedBuilder()
      .setTitle("[:toolbox:] Counters - Remove")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter === null) {
      throw new Error(
        "There is no counters in this channel, please add one first."
      );
    }

    await counterSchema
      ?.deleteOne({
        guildId: guild?.id,
        channelId: discordChannel?.id,
      })
      ?.then(async () => {
        logger?.silly(`Counter deleted`);

        await interaction?.editReply({
          embeds: [
            embed
              .setDescription(
                ":white_check_mark: Counter deleted successfully."
              )
              .setColor(successColor),
          ],
        });
        return;
      })
      .catch(() => {
        throw new Error("Failed deleting counter from database.");
      });
  },
};
