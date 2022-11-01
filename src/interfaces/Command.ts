import { SlashCommandBuilder } from "discord.js";

export interface ICommand {
  builder: SlashCommandBuilder;
  execute: Promise<void>;
}
