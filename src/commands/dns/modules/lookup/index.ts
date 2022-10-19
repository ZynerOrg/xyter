import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import getEmbedConfig from "../../../../../helpers/getEmbedData";

export default {
  metadata: { guildOnly: false, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("lookup")
      .setDescription(
        "Lookup a domain or ip. (Request sent over HTTP, proceed with caution!)"
      )
      .addStringOption((option) =>
        option
          .setName("query")
          .setDescription("The query you want to look up.")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const embedTitle = "[:hammer:] Utility (Lookup)";

    const { options } = interaction;
    const query = options.getString("query");

    await axios
      .get(`http://ip-api.com/json/${query}`)
      .then(async (response) => {
        if (response.data.status !== "success") {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle(embedTitle)
                .setFooter({
                  text: footerText,
                  iconURL: footerIcon,
                })
                .setTimestamp(new Date())
                .setColor(errorColor)
                .setFooter({ text: footerText, iconURL: footerIcon })
                .setDescription(
                  `${response?.data?.message}: ${response?.data?.query}`
                ),
            ],
          });
          return;
        }

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle(embedTitle)
              .setFooter({
                text: footerText,
                iconURL: footerIcon,
              })
              .setTimestamp(new Date())
              .setColor(successColor)
              .setFields([
                {
                  name: ":classical_building: AS",
                  value: `${response.data.as || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":classical_building: ISP",
                  value: `${response.data.isp || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":classical_building: Organization",
                  value: `${response.data.org || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":compass: Latitude",
                  value: `${response.data.lat || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":compass: Longitude",
                  value: `${response.data.lon || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":clock4: Timezone",
                  value: `${response.data.timezone || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":globe_with_meridians: Country",
                  value: `${response.data.country || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":globe_with_meridians: Region",
                  value: `${response.data.regionName || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":globe_with_meridians: City",
                  value: `${response.data.city || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":globe_with_meridians: Country Code",
                  value: `${response.data.countryCode || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":globe_with_meridians: Region Code",
                  value: `${response.data.region || "Unknown"}`,
                  inline: true,
                },
                {
                  name: ":globe_with_meridians: ZIP",
                  value: `${response.data.zip || "Unknown"}`,
                  inline: true,
                },
              ]),
          ],
        });
      });
  },
};
