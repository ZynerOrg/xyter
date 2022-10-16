import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import * as cooldown from "../../../../../helpers/cooldown";
import getEmbedConfig from "../../../../../helpers/getEmbedData";
import fetchUser from "../../../../../helpers/userData";
import logger from "../../../../../middlewares/logger";
import noSelfReputation from "./components/noSelfReputation";

export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("give")
      .setDescription("Give reputation to a user")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you want to repute.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("What type of reputation you want to repute")
          .setRequired(true)
          .addChoices(
            { name: "Positive", value: "positive" },
            {
              name: "Negative",
              value: "negative",
            }
          )
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { options, user, guild } = interaction;

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      guild
    ); // Destructure

    const optionTarget = options?.getUser("target");
    const optionType = options?.getString("type");

    if (!guild) throw new Error("Guild is undefined");

    const userObj = await fetchUser(user, guild);
    if (!userObj) throw new Error("User is undefined");

    // Pre-checks
    noSelfReputation(optionTarget, user);

    // Check if user is on cooldown otherwise create one
    await cooldown.command(interaction, process.env.REPUTATION_TIMEOUT);

    switch (optionType) {
      case "positive":
        userObj.reputation += 1;
        break;
      case "negative":
        userObj.reputation += 1;
        break;
      default:
        throw new Error("Invalid reputation type");
    }

    await userObj.save().then(async () => {
      logger.silly(`User reputation has been updated`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:loudspeaker:] Give")
        .setDescription(
          `You have given a ${optionType} repute to ${optionTarget}`
        )
        .setTimestamp()
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      await interaction.editReply({
        embeds: [interactionEmbed],
      });
    });
  },
};
