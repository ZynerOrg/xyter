// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
import encryption from "../../../../../../../handlers/encryption";
import apiSchema from "../../../../../../../models/api";

// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedConfig";

import { ButtonStyle, ChannelType } from "discord-api-types/v10";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("giveaway")
      .setDescription("Giveaway some credits for specified amount of users.")
      .addIntegerOption((option) =>
        option
          .setName("uses")
          .setDescription("How many users should be able to use this.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("credit")
          .setDescription(`How much credits provided per use.`)
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to send the message to.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure
    const { guild, options } = interaction;

    const uses = options?.getInteger("uses");
    const creditAmount = options?.getInteger("credit");
    const channel = options?.getChannel("channel");

    if (!uses) throw new Error("Amount of uses is required.");
    if (!creditAmount) throw new Error("Amount of credits is required.");
    if (!channel) throw new Error("Channel is required.");

    const embed = new EmbedBuilder()
      .setTitle("[:toolbox:] Giveaway")
      .setFooter({ text: footerText, iconURL: footerIcon });

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

    await api
      .post("vouchers", {
        uses,
        code,
        credits: creditAmount,
        memo: `[GIVEAWAY] ${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
      })
      .then(async () => {
        await interaction.editReply({
          embeds: [
            embed
              .setColor(successColor)
              .setDescription(`Successfully created code: ${code}`),
          ],
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Redeem it here")
            .setStyle(ButtonStyle.Link)
            .setEmoji("🏦")
            .setURL(`${shopUrl}?voucher=${code}`)
        );

        const discordChannel = guild?.channels.cache.get(channel.id);

        if (!discordChannel) return;

        if (discordChannel.type !== ChannelType.GuildText) return;

        discordChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("[:parachute:] Credits!")
              .addFields([
                {
                  name: "💶 Credits",
                  value: `${creditAmount}`,
                  inline: true,
                },
              ])
              .setDescription(
                `${interaction.user} dropped a voucher for a maximum **${uses}** members!`
              )
              .setColor(successColor),
          ],
          components: [buttons],
        });
      });
  },
};
