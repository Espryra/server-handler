import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../../../types/discord";
import Server from "../../server";
import Replies from "../replies";

const ListBackupsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("listbackups")
    .setDescription("List all of your backups."),

  callback: async (interaction) => {
    await interaction.deferReply();

    const backups = Server.Backups();

    if (backups.length === 0) {
      Replies.NoBackups(interaction);
      return;
    }

    Replies.ViewBackups(interaction, backups);
  },
};

export default ListBackupsCommand;
