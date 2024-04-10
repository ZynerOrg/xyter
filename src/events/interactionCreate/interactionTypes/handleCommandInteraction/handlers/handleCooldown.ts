import { Cooldown } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import sendResponse from "../../../../../utils/sendResponse";

export default async function handleCooldown(
  interaction: CommandInteraction,
  guildCooldown: Cooldown | null,
  userCooldown: Cooldown | null,
  guildMemberCooldown: Cooldown | null
) {
  const cooldown = guildCooldown || userCooldown || guildMemberCooldown;

  if (!cooldown || !cooldown.expiresAt) {
    return;
  }

  const timeLeft = formatDistanceToNow(cooldown.expiresAt, {
    includeSeconds: true,
  });

  const buttons = createButtons();

  const cooldownEmbed = createCooldownEmbed(timeLeft, cooldown.id);

  const response = {
    embeds: [cooldownEmbed],
    components: [buttons],
    ephemeral: true,
  };

  await sendResponse(interaction, response);
}

function createButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Report Problem")
      .setStyle(ButtonStyle.Link)
      .setEmoji("✏️")
      .setURL("https://s.zyner.org/discord")
  );
}

function createCooldownEmbed(timeLeft: string, cooldownId: string) {
  return new EmbedBuilder()
    .setAuthor({ name: "⚠️ | Request Failed" })
    .setDescription(
      `Sorry, but you're currently on cooldown. Please try again later.\n\nRemaining cooldown time: ${timeLeft}`
    )
    .setColor("#FF6699")
    .setTimestamp()
    .setFooter({ text: `Cooldown ID: ${cooldownId}` });
}
