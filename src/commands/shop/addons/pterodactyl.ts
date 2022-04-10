import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import apis from "../../../helpers/database/models/apiSchema";
import users from "../../../helpers/database/models/userSchema";
import creditNoun from "../../../helpers/creditNoun";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  const { member } = interaction;

  // Get options
  const amount = await interaction.options.getInteger("amount");

  if (amount === null) return;

  // Get user object
  const userDB = await users.findOne({
    userId: interaction?.user?.id,
    guildId: interaction?.guild?.id,
  });

  // Get DM user object
  const dmUser = interaction.client.users.cache.get(interaction?.user?.id);

  // Stop if amount or user credits is below 100
  if ((amount || userDB.credits) < 100) {
    const embed = {
      title: ":shopping_cart: Shop - Pterodactyl",
      description: `You **can't** withdraw for __Pterodactyl__ below **100**.`,
      color: config.colors.error as any,
      fields: [
        { name: "Your balance", value: `${creditNoun(userDB.credits)}` },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed] });
  }

  // Stop if amount or user credits is above 1.000.000
  if ((amount || userDB.credits) > 1000000) {
    const embed = {
      title: ":shopping_cart: Shop - Pterodactyl",
      description: `You **can't** withdraw for __Pterodactyl__ above **1.000.000**.`,
      color: config.colors.error as any,
      fields: [
        { name: "Your balance", value: `${creditNoun(userDB.credits)}` },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed] });
  }

  // Stop if user credits is below amount
  if (userDB.credits < amount) {
    const embed = {
      title: ":shopping_cart: Shop - Pterodactyl",
      description: `You have **insufficient** credits.`,
      color: config.colors.error as any,
      fields: [
        { name: "Your balance", value: `${creditNoun(userDB.credits)}` },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };
    return interaction.editReply({ embeds: [embed] });
  }

  // Generate a unique voucher for the user
  const code = uuidv4();

  // Get api object
  const apiCredentials = await apis.findOne({
    guildId: interaction?.guild?.id,
  });

  // Create a api instance
  const api = axios.create({
    baseURL: apiCredentials.url,
    headers: { Authorization: `Bearer ${apiCredentials.token}` },
  });

  // Get shop URL
  const shopUrl = apiCredentials.url.replace("/api", "/store");

  // Make API request
  await api

    // Make a post request to the API
    .post("vouchers", {
      uses: 1,
      code,
      credits: amount || userDB.credits,
      memo: `${interaction.createdTimestamp} - ${interaction?.user?.id}`,
    })

    // If successful
    .then(async () => {
      // Create DM embed object
      const dmEmbed = {
        title: ":shopping_cart: Shop - Pterodactyl",
        description: `Redeem this voucher [here](${shopUrl})!`,
        fields: [
          { name: "Code", value: `${code}`, inline: true },
          {
            name: "Credits",
            value: `${amount || userDB.credits}`,
            inline: true,
          },
        ],
        color: config.colors.success as any,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Create interaction embed object
      const interactionEmbed = {
        title: ":shopping_cart: Shop - Pterodactyl",
        description: "I have sent you the code in DM!",
        color: config.colors.success as any,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Withdraw amount from user credits
      userDB.credits -= amount || userDB.credits;

      // Save new credits
      await userDB
        .save()
        // If successful
        .then(async () => {
          // Send debug message
          await logger.debug(
            `User: ${interaction?.user?.username} redeemed: ${creditNoun(
              amount
            )}`
          );

          // Send DM message
          await dmUser?.send({ embeds: [dmEmbed] });

          // Send interaction reply
          await interaction.editReply({
            embeds: [interactionEmbed],
          });
        })

        // If error occurs
        .catch(async (e: any) => {
          await logger.error(e);
          const embed = {
            title: ":shopping_cart: Shop - Pterodactyl",
            description: "Something went wrong, please try again later.",
            color: config.colors.error as any,
            timestamp: new Date(),
            footer: { iconURL: config.footer.icon, text: config.footer.text },
          };
          return interaction.editReply({ embeds: [embed] });
        });
    })

    // If error occurs
    .catch(async (e) => {
      await logger.error(e);
      const embed = {
        title: ":shopping_cart: Shop - Pterodactyl",
        description: "Something went wrong, please try again later.",
        color: config.colors.error as any,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };
      return interaction.editReply({ embeds: [embed] });
    });
};
