import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Cache from "../../../utils/cache";
import FileManager from "../../../utils/fileManager";
import Server from "../../server";
import Replies from "../replies";

const BackupCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("Create a new backup now."),

  callback: async (interaction) => {
    await interaction.deferReply();

    if (FileManager.Exists(Cache.Config.root_path + "cache")) {
      Replies.CacheInUse(interaction);
      return;
    }
    if (!FileManager.Exists(Cache.Config.root_path + "server")) {
      Replies.ServerNotInstalled(interaction);
      return;
    }

    Replies.BackupInProcess(interaction);

    const request = await Server.Backup();

    switch (request) {
      case 0:
        Replies.BackupCreated(interaction);
        break;
      case 1:
        Replies.CacheInUse(interaction);
        break;

      default:
        Replies.InternalError(interaction);
        break;
    }
  },
};

export default BackupCommand;
