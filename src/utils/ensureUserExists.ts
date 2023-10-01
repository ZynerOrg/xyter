import { Interaction, User } from "discord.js";

export default function ensureUserExists(interaction: Interaction): User {
  if (!interaction.user) {
    throw new Error(
      "Oops! We couldn't find your user information. Please try again or contact support for assistance."
    );
  }
  return interaction.user;
}
