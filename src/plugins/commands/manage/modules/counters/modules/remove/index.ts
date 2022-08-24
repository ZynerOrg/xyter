// Dependencies
import { CommandInteraction, MessageEmbed, Permissions } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";

// Handlers
import logger from "../../../../../../../middlewares/logger";

// Models
import counterSchema from "../../../../../../../models/counter";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
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
  execute: async (interaction: CommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");

    const embed = new MessageEmbed()
      .setTitle("[:toolbox:] Counters - Remove")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    const counter = await counterSchema?.findOne({
      guildId: guild?.id,
      channelId: discordChannel?.id,
    });

    if (counter === null) {
      logger?.silly(`Counter is null`);

      return interaction?.editReply({
        embeds: [
          embed
            .setDescription(
              ":x: There is no counter in this channel. Please add a counter first."
            )
            .setColor(errorColor),
        ],
      });
    }

    await counterSchema
      ?.deleteOne({
        guildId: guild?.id,
        channelId: discordChannel?.id,
      })
      ?.then(async () => {
        logger?.silly(`Counter deleted`);

        return interaction?.editReply({
          embeds: [
            embed
              .setDescription(
                ":white_check_mark: Counter deleted successfully."
              )
              .setColor(successColor),
          ],
        });
      })
      .catch(async (error) => {
        logger?.error(`Error deleting counter: ${error}`);
      });
  },
};
