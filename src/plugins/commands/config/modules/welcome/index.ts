import { CommandInteraction, Permissions } from "discord.js";

import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import logger from "../../../../../middlewares/logger";

import guildSchema from "../../../../../models/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("welcome")
      .setDescription("Welcome")
      .addBooleanOption((option) =>
        option.setName("status").setDescription("Should welcome be enabled?")
      )
      .addChannelOption((option) =>
        option
          .setName("join-channel")
          .setDescription("Channel for join messages.")
          .addChannelTypes(ChannelType.GuildText)
      )

      .addChannelOption((option) =>
        option
          .setName("leave-channel")
          .setDescription("Channel for leave messages.")
          .addChannelTypes(ChannelType.GuildText)
      )

      .addStringOption((option) =>
        option
          .setName("leave-message")
          .setDescription("Message for leave messages.")
      )
      .addStringOption((option) =>
        option
          .setName("join-message")
          .setDescription("Message for join messages.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const status = options?.getBoolean("status");
    const joinChannel = options?.getChannel("join-channel");
    const leaveChannel = options?.getChannel("leave-channel");
    const joinChannelMessage = options?.getString("join-message");
    const leaveChannelMessage = options?.getString("leave-message");

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild not found in database.`);
    }

    guildDB.welcome.status =
      status !== null ? status : guildDB?.welcome?.status;
    guildDB.welcome.joinChannel =
      joinChannel !== null ? joinChannel.id : guildDB?.welcome?.joinChannel;
    guildDB.welcome.leaveChannel =
      leaveChannel !== null ? leaveChannel.id : guildDB?.welcome?.leaveChannel;

    guildDB.welcome.joinChannelMessage =
      joinChannelMessage !== null
        ? joinChannelMessage
        : guildDB?.welcome?.joinChannelMessage;
    guildDB.welcome.leaveChannelMessage =
      leaveChannelMessage !== null
        ? leaveChannelMessage
        : guildDB?.welcome?.leaveChannelMessage;

    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild welcome updated.`);

      if (!guildDB?.welcome?.status) {
        return interaction?.editReply({
          embeds: [
            {
              title: "[:tools:] Welcome",
              description: `This module is currently disabled, please enable it to continue.`,
              color: successColor,
              timestamp: new Date(),
              footer: {
                iconURL: footerIcon,
                text: footerText,
              },
            },
          ],
        });
      }

      return interaction?.editReply({
        embeds: [
          {
            title: "[:tools:] Welcome",
            description: `The following configuration will be used.

            [👋] **Welcome**

            ㅤ**Channel**: <#${guildDB?.welcome?.joinChannel}>
            ㅤ**Message**: ${guildDB?.welcome?.joinChannelMessage}

            [🚪] **Leave**

            ㅤ**Channel**: <#${guildDB?.welcome?.leaveChannel}>
            ㅤ**Message**: ${guildDB?.welcome?.leaveChannelMessage}`,
            color: successColor,
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    });
  },
};
