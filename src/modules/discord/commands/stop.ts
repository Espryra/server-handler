import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Server from "../../server";
import Replies from "../replies";

const StopCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop your server."),

  callback: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    if (!Server.IsOnline) {
      Replies.ServerAlreadyoff(interaction);
      return;
    }

    const request = Server.Write("stop");

    if (!request) {
      Replies.InternalError(interaction);
      return;
    }

    Replies.ServerStopped(interaction);
    interaction;
  },
};

export default StopCommand;
