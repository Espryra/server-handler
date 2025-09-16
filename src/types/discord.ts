import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder;
  callback: (interaction: ChatInputCommandInteraction) => void;
}
