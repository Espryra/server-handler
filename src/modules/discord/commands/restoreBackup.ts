import { spawn } from "child_process";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Cache from "../../../utils/cache";
import FileManager from "../../../utils/fileManager";
import Server from "../../server";
import Replies from "../replies";

const RestoreBackupCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("restorebackup")
    .setDescription("Restore the files of a backup.")
    .addStringOption((option) =>
      option
        .setName("file")
        .setDescription("The file name that you can get via /listbackups.")
        .setRequired(true)
    ),

  callback: async (interaction) => {
    await interaction.deferReply();

    const file = interaction.options.getString("file", true);

    if (FileManager.Exists(Cache.Config.root_path + "cache")) {
      Replies.CacheInUse(interaction);
      return;
    }
    if (!FileManager.Exists(Cache.Config.root_path + "backups/" + file)) {
      Replies.BackupNotFound(interaction);
      return;
    }
    if (Server.IsOnline) {
      Replies.ServerAlreadyOn(interaction);
      return;
    }

    const process = spawn("./restore.sh", {
      cwd: Cache.Config.root_path + "scripts",
      env: {
        cachepath: Cache.Config.root_path + "cache",
        backuppath: Cache.Config.root_path + "backups",
        serverpath: Cache.Config.root_path + "server",
        filename: file,
      },
    });

    process.once("spawn", () => {
      Replies.RestoringBackup(interaction);
    });
    process.once("exit", (code) => {
      switch (code) {
        case 0:
          Replies.BackupRestored(interaction);
          break;
        case 1:
          Replies.CacheInUse(interaction);
          break;

        default:
          Replies.InternalError(interaction);
          break;
      }
    });
  },
};

export default RestoreBackupCommand;
