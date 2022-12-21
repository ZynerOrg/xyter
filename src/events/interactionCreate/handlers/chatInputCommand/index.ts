import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import getEmbedData from "../../../../helpers/getEmbedData";

export default async (interaction: ChatInputCommandInteraction) => {
  const { errorColor, footerText, footerIcon } = await getEmbedData(
    interaction.guild
  );

  if (!interaction.isCommand()) return;
  const { client, commandName } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) throw new Error(`Unknown command ${commandName}`);

  await currentCommand.execute(interaction).catch((error: Error) => {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Report Problem")
        .setStyle(ButtonStyle.Link)
        .setEmoji("✏️")
        .setURL("https://discord.zyner.org")
    );

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`:no_entry_sign:︱Your request failed`)
          .setDescription(`${error.message}`)
          .setColor(errorColor)
          .setTimestamp(new Date())
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
      components: [buttons],
    });
  });
};
