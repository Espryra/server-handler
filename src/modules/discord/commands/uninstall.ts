import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Cache from "../../../utils/cache";
import FileManager from "../../../utils/fileManager";
import Server from "../../server";
import Replies from "../replies";

const UninstallCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("uninstall")
    .setDescription("Uninstall your minecraft server.")
    .addStringOption((option) =>
      option
        .setName("confirm")
        .setDescription(
          'Are you sure you would like to do this? If so, please type "I AM SURE"'
        )
        .setRequired(true)
    ),

  callback: async (interaction) => {
    await interaction.deferReply();

    const confirm = interaction.options.getString("confirm", true);

    if (confirm !== "I AM SURE") {
      Replies.CancelledUninstall(interaction);
      return;
    }
    if (!FileManager.Exists(Cache.Config.root_path + "server")) {
      Replies.ServerNotInstalled(interaction);
      return;
    }
    if (Server.IsOnline) {
      Replies.ServerAlreadyOn(interaction);
      return;
    }

    FileManager.Delete(Cache.Config.root_path + "server");

    Replies.ServerUninstalled(interaction);
  },
};

export default UninstallCommand;
