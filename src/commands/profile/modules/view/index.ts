// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedData";
// Models
import fetchUser from "../../../../../helpers/userData";
import logger from "../../../../../middlewares/logger";

// Function
export default {
  metadata: { guildOnly: true, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription("View a profile.")
      .addUserOption((option) =>
        option.setName("target").setDescription("The profile you wish to view")
      );
  },

  execute: async (interaction: CommandInteraction) => {
    const { errorColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure
    const { client, options, user, guild } = interaction;

    // Target information
    const target = options?.getUser("target");

    // Discord User Information
    const discordUser = await client?.users?.fetch(
      `${target ? target?.id : user?.id}`
    );

    if (guild === null) {
      return logger?.silly(`Guild is null`);
    }

    // User Information
    const userObj = await fetchUser(discordUser, guild);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${discordUser?.username}#${discordUser?.discriminator}`,
        iconURL: discordUser?.displayAvatarURL(),
      })
      .addFields(
        {
          name: `:dollar: Credits`,
          value: `${userObj?.credits || "Not found"}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: Level`,
          value: `${userObj?.level || "Not found"}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: Points`,
          value: `${userObj?.points || "Not found"}`,
          inline: true,
        },
        {
          name: `:loudspeaker: Reputation`,
          value: `${userObj?.reputation || "Not found"}`,
          inline: true,
        },
        {
          name: `:rainbow_flag: Language`,
          value: `${userObj?.language || "Not found"}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setColor(errorColor)
      .setFooter({ text: footerText, iconURL: footerIcon });

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  },
};
