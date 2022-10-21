import { SlashCommandBuilder } from "@discordjs/builders";

export interface ICommand {
  builder: SlashCommandBuilder;
  execute: Promise<void>;
}
