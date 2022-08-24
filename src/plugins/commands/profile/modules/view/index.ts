// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

// Models
import fetchUser from "../../../../../helpers/fetchUser";

import logger from "../../../../../middlewares/logger";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

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
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
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

    // Embed object
    const embed = {
      author: {
        name: `${discordUser?.username}#${discordUser?.discriminator}`,
        icon_url: discordUser?.displayAvatarURL(),
      },
      color: successColor,
      fields: [
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
        },
      ],
      timestamp: new Date(),
      footer: {
        iconURL: footerIcon,
        text: footerText,
      },
    };

    // Return interaction reply
    return interaction?.editReply({ embeds: [embed] });
  },
};
