import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("avatar")
    .setDescription("Check someones avatar!)")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user whose avatar you want to check")
    );
};

export const execute = async (interaction: CommandInteraction) => {
  await deferReply(interaction, false);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );
  const userOption = interaction.options.getUser("user");

  const targetUser = userOption || interaction.user;

  const embed = new EmbedBuilder()
    .setTitle(":toolbox:︱Avatar")
    .setTimestamp(new Date())
    .setFooter({ text: footerText, iconURL: footerIcon });

  const avatarUrl = targetUser.displayAvatarURL();

  return interaction.editReply({
    embeds: [
      embed
        .setDescription(
          userOption
            ? `You can also [download it here](${avatarUrl})!`
            : `Your avatar is available to [download here](${avatarUrl}).`
        )
        .setThumbnail(avatarUrl)
        .setColor(successColor),
    ],
  });
};
