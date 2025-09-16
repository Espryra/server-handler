import {
  Client,
  IntentsBitField,
  MessageFlags,
  REST,
  Routes,
} from "discord.js";
import type { Command } from "../../types/discord";
import Cache from "../../utils/cache";
import Logger from "../../utils/logger";
import BackupCommand from "./commands/backup";
import InstallCommand from "./commands/install";
import ListBackupsCommand from "./commands/listBackups";
import RestoreBackupCommand from "./commands/restoreBackup";
import StartCommand from "./commands/start";
import StopCommand from "./commands/stop";
import UninstallCommand from "./commands/uninstall";

export default class Discord {
  private static Client: Client;
  private static Commands: Command[];

  public static async Init(): Promise<void> {
    const token = process.env.DISCORDCLIENTTOKEN;
    const id = process.env.DISCORDCLIENTID;

    if (!token || !id) {
      Logger.Error("Missing discord client id and/or token.");
      return;
    }

    Discord.Commands = [
      InstallCommand,
      UninstallCommand,
      StartCommand,
      StopCommand,
      BackupCommand,
      ListBackupsCommand,
      RestoreBackupCommand,
    ];
    Discord.Client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
      ],
    });

    await this.Deploy(id, token);

    Discord.Client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }
      if (!interaction.guild) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        interaction.editReply({ content: "I only work in discord servers!" });
        return;
      }

      const command = Discord.Commands.find(
        (command) => command.data.name === interaction.commandName
      );

      if (!command) {
        Logger.Warn(
          interaction.user.username,
          "has ran a command that does not exist:",
          interaction.commandName
        );
        return;
      }

      const cooldown = Cache.Cooldowns[interaction.user.id];

      if (!cooldown || new Date() > cooldown) {
        Cache.Cooldowns[interaction.user.id] = new Date(
          Date.now() + Cache.Config.discord_cooldown * 1000
        );

        command.callback(interaction);
        return;
      }

      await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });

      interaction.editReply({
        content: `Please wait a moment before running anymore commands.`,
      });
    });

    Discord.Client.login(token)
      .then(() => {
        Logger.Success(
          `Successfully logged in as ${Discord.Client.user?.username}!`
        );
      })
      .catch((error) => {
        Logger.Error(error, error.stack);
      });
  }

  private static async Deploy(id: string, token: string): Promise<void> {
    const rest = new REST({ version: "10" });

    rest.setToken(token);

    try {
      await rest.put(Routes.applicationCommands(id), {
        body: Discord.Commands.map((command) => command.data.toJSON()),
      });

      Logger.Success(
        `Successfully deployed ${Discord.Commands.length} commands!`
      );
    } catch (error) {
      Logger.Error("Error while deploying discord commands.", error);
    }
  }
}
