import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../handlers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedData";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("avatar")
      .setDescription("Check someones avatar!)")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user whose avatar you want to check")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    await deferReply(interaction, false);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const userOption = interaction.options.getUser("user");

    const targetUser = userOption || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle("[:tools:] Avatar")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(`${targetUser.username}'s avatar:`)
          .setThumbnail(targetUser.displayAvatarURL())
          .setColor(successColor),
      ],
    });
  },
};
