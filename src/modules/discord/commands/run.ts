import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Server from "../../server";
import Replies from "../replies";

const RunCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("run")
    .setDescription("Run a command to the server, as server level.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("The command you would like to run.")
        .setRequired(true)
    ),

  callback: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    const command = interaction.options.getString("command", true);

    if (!Server.IsOnline) {
      Replies.ServerOffline(interaction);
      return;
    }
    if (command.startsWith("/")) {
      Replies.SlashDetected(interaction);
      return;
    }

    const request = Server.Write(command);

    if (!request) {
      Replies.InternalError(interaction);
      return;
    }

    Replies.CommandRan(interaction);
  },
};

export default RunCommand;
