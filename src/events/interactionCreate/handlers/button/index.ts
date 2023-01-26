import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import getEmbedData from "../../../../helpers/getEmbedConfig";

export default async (interaction: ButtonInteraction) => {
  const { errorColor, footerText, footerIcon } = await getEmbedData(
    interaction.guild
  );
  const { customId } = interaction;

  const currentButton = await import(`../../../buttons/${customId}`);

  if (!currentButton) throw new Error(`Unknown button ${customId}`);

  await currentButton.execute(interaction).catch((error: Error) => {
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
