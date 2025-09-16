import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Cache from "../../../utils/cache";
import FileManager from "../../../utils/fileManager";
import Server from "../../server";
import Replies from "../replies";

const StartCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start your server."),
  callback: async (interaction) => {
    await interaction.deferReply();

    if (Server.IsOnline) {
      Replies.ServerAlreadyOn(interaction);
      return;
    }
    if (!FileManager.Exists(Cache.Config.root_path + "server")) {
      Replies.ServerNotInstalled(interaction);
      return;
    }

    const request = Server.Start();

    if (!request) {
      Replies.InternalError(interaction);
      return;
    }

    Replies.ServerStarted(interaction);
  },
};

export default StartCommand;
