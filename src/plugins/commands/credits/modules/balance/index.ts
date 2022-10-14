import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import getEmbedConfig from "../../../../../helpers/getEmbedData";
import fetchUser from "../../../../../helpers/userData";
import logger from "../../../../../middlewares/logger";

export default {
  metadata: { guildOnly: true, ephemeral: true },
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("balance")
      .setDescription(`View a user's balance`)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription(`The user whose balance you want to view`)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, user, guild } = interaction;

    const discordUser = options.getUser("user");

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Balance")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (guild === null) {
      logger.silly(`Guild is null`);

      return interaction.editReply({
        embeds: [
          embed.setDescription("Guild is not found").setColor(errorColor),
        ],
      });
    }

    const userObj = await fetchUser(discordUser || user, guild);

    if (userObj === null) {
      logger.silly(`User not found`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "User is not found. Please try again with a valid user."
            )
            .setColor(errorColor),
        ],
      });
    }

    if (userObj.credits === null) {
      logger.silly(`User has no credits`);

      return interaction.editReply({
        embeds: [
          embed.setDescription("Credits not found").setColor(errorColor),
        ],
      });
    }

    logger.silly(`Found user ${discordUser || user}`);

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${discordUser || user} currently has ${userObj.credits} credits.`
          )
          .setColor(successColor),
      ],
    });
  },
};
