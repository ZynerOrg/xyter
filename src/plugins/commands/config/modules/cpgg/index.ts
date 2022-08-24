import { CommandInteraction, Permissions } from "discord.js";

import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import logger from "../../../../../middlewares/logger";

import apiSchema from "../../../../../models/api";
import encryption from "../../../../../handlers/encryption";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("cpgg")
      .setDescription("Controlpanel.gg")
      .addStringOption((option) =>
        option
          .setName("scheme")
          .setDescription(`Controlpanel.gg Scheme`)
          .setRequired(true)
          .setChoices(
            { name: "HTTPS (secure)", value: "https" },
            { name: "HTTP (insecure)", value: "http" }
          )
      )
      .addStringOption((option) =>
        option
          .setName("domain")
          .setDescription(`Controlpanel.gg Domain`)
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("token")
          .setDescription(`Controlpanel.gg Application API`)
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const tokenData = options.getString("token");
    const scheme = options.getString("scheme");
    const domain = options.getString("domain");
    const token = tokenData && encryption.encrypt(tokenData);
    const url = scheme && domain && encryption.encrypt(`${scheme}://${domain}`);

    await apiSchema
      ?.findOneAndUpdate(
        { guildId: guild?.id },
        { url, token },
        { new: true, upsert: true }
      )
      .then(async () => {
        logger?.silly(`Updated API credentials.`);

        return interaction?.editReply({
          embeds: [
            {
              title: "[:tools:] CPGG",
              description: `The following configuration will be used.

              **Scheme**: ${scheme}
              **Domain**: ${domain}
              **Token**: ends with ${tokenData?.slice(-4)}`,
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
