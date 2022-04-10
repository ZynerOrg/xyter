import axios from "axios";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  try {
    // Get lookup query
    const query = await interaction.options.getString("query");

    // Make API request
    await axios
      // Make a get request
      .get(`http://ip-api.com/json/${query}`)

      // If successful
      .then(async (res) => {
        // If query failed
        if (res.data.status === "fail") {
          // Create embed object
          const embed = {
            title: ":hammer: Utilities - Lookup",
            description: `${res.data.message}: ${res.data.query}`,
            color: config.colors.error as any,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };

          // Send interaction reply
          await interaction.editReply({ embeds: [embed] });
        }

        // If query is successful
        else if (res.data.status === "success") {
          // Create embed object
          const embed = {
            title: ":hammer: Utilities - Lookup",
            fields: [
              { name: "AS", value: `${res.data.as || "Not available"}` },
              {
                name: "Country",
                value: `${res.data.country || "Not available"}`,
              },
              {
                name: "Country Code",
                value: `${res.data.countryCode || "Not available"}`,
              },
              {
                name: "Region",
                value: `${res.data.region || "Not available"}`,
              },
              {
                name: "Region Name",
                value: `${res.data.regionName || "Not available"}`,
              },
              { name: "City", value: `${res.data.city || "Not available"}` },
              { name: "ZIP Code", value: `${res.data.zip || "Not available"}` },
              { name: "Latitude", value: `${res.data.lat || "Not available"}` },
              {
                name: "Longitude",
                value: `${res.data.lon || "Not available"}`,
              },
              {
                name: "Timezone",
                value: `${res.data.timezone || "Not available"}`,
              },
              { name: "ISP", value: `${res.data.isp || "Not available"}` },
              {
                name: "Organization",
                value: `${res.data.org || "Not available"}`,
              },
            ],
            color: config.colors.success as any,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };

          // Send interaction reply
          await interaction.editReply({ embeds: [embed] });
        }
      })
      .catch(async (e) => {
        await logger.error(e);
      });
  } catch (e) {
    await logger.error(e);
  }
};
