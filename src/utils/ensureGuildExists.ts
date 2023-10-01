import { Guild, Interaction } from "discord.js";

export default function ensureGuildExists(interaction: Interaction): Guild {
  if (!interaction.guild) {
    throw new Error(
      "Oops! It looks like you're not part of a guild. Join a guild to embark on this adventure!"
    );
  }
  return interaction.guild;
}
