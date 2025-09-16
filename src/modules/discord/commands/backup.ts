import { spawn } from "child_process";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Cache from "../../../utils/cache";
import FileManager from "../../../utils/fileManager";
import Replies from "../replies";

const BackupCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Create a new backup now."),

  callback: async (interaction) => {
    await interaction.deferReply();

    if (FileManager.Exists(Cache.Config.root_path + "cache")) {
      Replies.BackupAlreadyRunning(interaction);
      return;
    }
    if (!FileManager.Exists(Cache.Config.root_path + "server")) {
      Replies.ServerNotInstalled(interaction);
      return;
    }

    const process = spawn("./backup.sh", {
      cwd: Cache.Config.root_path + "scripts",
      env: {
        rootpath: Cache.Config.root_path,
        cachepath: Cache.Config.root_path + "cache",
        serverpath: Cache.Config.root_path + "server",
        backuppath: Cache.Config.root_path + "backups",
        backupitems: Cache.Config.backup_items.join(" "),
        filename: new Date().toISOString() + ".tar.xz",
      },
    });

    process.once("spawn", () => {
      Replies.BackupInProcess(interaction);
    });
    process.once("exit", (code) => {
      switch (code) {
        case 0:
          Replies.BackupCreated(interaction);
          break;
        case 1:
          Replies.BackupAlreadyRunning(interaction);
          break;

        default:
          Replies.InternalError(interaction);
          break;
      }
    });
  },
};

export default BackupCommand;
