import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";

import encryption from "../../../../../handlers/encryption";
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";
import logger from "../../../../../middlewares/logger";

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import fetchUser from "../../../../../helpers/fetchUser";
import pluralize from "../../../../../helpers/pluralize";
import apiSchema from "../../../../../models/api";

export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("cpgg")
      .setDescription("Buy cpgg power.")
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("How much credits you want to withdraw.")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, guild, user, client } = interaction;

    const optionAmount = options?.getInteger("amount");

    if (optionAmount === null) {
      logger?.silly(`Amount is null.`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:dollar:] Gift")
        .setDescription("We could not read your requested amount.")
        .setTimestamp()
        .setColor(errorColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      return interaction?.editReply({
        embeds: [interactionEmbed],
      });
    }

    if (guild === null) {
      return logger?.silly(`Guild is null`);
    }

    const userDB = await fetchUser(user, guild);

    if (userDB === null) {
      return logger?.silly(`User is null`);
    }

    const dmUser = client?.users?.cache?.get(user?.id);

    if ((optionAmount || userDB?.credits) < 100) {
      logger?.silly(`Amount or user credits is below 100.`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:shopping_cart:] CPGG")
        .setDescription("You **can't** withdraw for __CPGG__ below **100**.")
        .setTimestamp()
        .addFields({
          name: "Your balance",
          value: `${pluralize(userDB?.credits, "credit")}`,
        })
        .setColor(errorColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      return interaction?.editReply({
        embeds: [interactionEmbed],
      });
    }

    if ((optionAmount || userDB?.credits) > 1000000) {
      logger?.silly(`Amount or user credits is above 1.000.000.`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:shopping_cart:] CPGG")
        .setDescription(
          "You **can't** withdraw for __CPGG__ above **1.000.000**."
        )
        .setTimestamp()
        .addFields({
          name: "Your balance",
          value: `${pluralize(userDB?.credits, "credit")}`,
        })
        .setColor(errorColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      return interaction?.editReply({
        embeds: [interactionEmbed],
      });
    }

    if (userDB?.credits < optionAmount) {
      logger?.silly(`User credits is below amount.`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:shopping_cart:] CPGG")
        .setDescription("You have **insufficient** credits.")
        .setTimestamp()
        .addFields({
          name: "Your balance",
          value: `${pluralize(userDB?.credits, "credit")}`,
        })
        .setColor(errorColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      return interaction?.editReply({
        embeds: [interactionEmbed],
      });
    }

    const code = uuidv4();

    const apiCredentials = await apiSchema?.findOne({
      guildId: guild?.id,
    });

    if (!apiCredentials) return;
    const url = encryption.decrypt(apiCredentials?.url);

    const api = axios?.create({
      baseURL: `${url}/api/`,
      headers: {
        Authorization: `Bearer ${encryption.decrypt(apiCredentials.token)}`,
      },
    });

    const shopUrl = `${url}/store`;

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Redeem it here")
        .setStyle(ButtonStyle.Link)
        .setEmoji("🏦")
        .setURL(`${shopUrl}?voucher=${code}`)
    );

    await api

      ?.post("vouchers", {
        uses: 1,
        code,
        credits: optionAmount || userDB?.credits,
        memo: `${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
      })

      ?.then(async () => {
        logger?.silly(`Successfully created voucher.`);

        userDB.credits -= optionAmount || userDB?.credits;

        await userDB
          ?.save()

          ?.then(async () => {
            logger?.silly(`Successfully saved new credits.`);

            if (!interaction.guild) throw new Error("Guild is undefined");

            const dmEmbed = new EmbedBuilder()
              .setTitle("[:shopping_cart:] CPGG")
              .setDescription(
                `This voucher comes from **${interaction.guild.name}**.`
              )
              .setTimestamp()
              .addFields({
                name: "💶 Credits",
                value: `${optionAmount || userDB?.credits}`,
                inline: true,
              })
              .setColor(successColor)
              .setFooter({ text: footerText, iconURL: footerIcon });

            await dmUser
              ?.send({
                embeds: [dmEmbed],
                components: [buttons],
              })
              .then(async (msg: Message) => {
                const interactionEmbed = new EmbedBuilder()
                  .setTitle("[:shopping_cart:] CPGG")
                  .setDescription(
                    `I have sent you the code in [DM](${msg.url})!`
                  )
                  .setTimestamp()
                  .setColor(successColor)
                  .setFooter({ text: footerText, iconURL: footerIcon });

                return interaction?.editReply({
                  embeds: [interactionEmbed],
                });
              });
          })

          .catch(async (error) => {
            logger?.silly(`Error saving new credits. - ${error}`);

            const interactionEmbed = new EmbedBuilder()
              .setTitle("[:shopping_cart:] CPGG")
              .setDescription(`Something went wrong.`)
              .setTimestamp()
              .setColor(errorColor)
              .setFooter({ text: footerText, iconURL: footerIcon });

            return interaction?.editReply({
              embeds: [interactionEmbed],
            });
          });
      })

      .catch(async (error) => {
        logger?.silly(`Error creating voucher. - ${error}`);

        const interactionEmbed = new EmbedBuilder()
          .setTitle("[:shopping_cart:] CPGG")
          .setDescription(`Something went wrong.`)
          .setTimestamp()
          .setColor(errorColor)
          .setFooter({ text: footerText, iconURL: footerIcon });

        return interaction?.editReply({
          embeds: [interactionEmbed],
        });
      });
  },
};
