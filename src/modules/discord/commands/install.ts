import { spawn } from "child_process";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Cache from "../../../utils/cache";
import Replies from "../replies";

const InstallCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("install")
    .setDescription("Install your minecraft server.")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The server link for the installation file.")
        .setRequired(true)
    ),

  callback: async (interaction) => {
    await interaction.deferReply();

    Replies.InstallSettingUp(interaction);

    const link = interaction.options.getString("link", true);
    const process = spawn("./install.sh", {
      cwd: Cache.Config.root_path + "scripts",
      env: {
        serverpath: Cache.Config.root_path + "server",
        serverlink: link,
      },
    });

    process.once("exit", (code) => {
      switch (code) {
        case 0:
          Replies.InstallSuccessful(interaction);
          break;
        case 2:
          Replies.AlreadyInstalled(interaction);
          break;

        default:
          Replies.InternalError(interaction);
          break;
      }
    });
  },
};

export default InstallCommand;
