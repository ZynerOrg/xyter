import { User } from "discord.js";

export default (to: User | null, from: User | null) => {
  if (from?.id === to?.id) {
    throw new Error("You cannot give reputation to yourself.");
  }
};
