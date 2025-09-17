import {
  Colors,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { Backup } from "../../types/server";

function baseResponse(interaction: ChatInputCommandInteraction): EmbedBuilder {
  return new EmbedBuilder({
    timestamp: new Date(),
    thumbnail: { url: interaction.user.avatarURL() ?? "" },
    footer: {
      text: interaction.guild?.name ?? "",
      icon_url: interaction.guild?.iconURL() ?? "",
    },
  });
}

const Replies = {
  // General
  MissingPermission: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Invalid Permission");
    embed.setDescription("You are not allowed to use any of my commands!");
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },
  InternalError: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Internal Error");
    embed.setDescription(
      `It seems I have ran into a internal error while trying to process your command. Please contact my developer for help!`
    );
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },
  ServerNotInstalled: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Not Installed");
    embed.setDescription(
      "You cannot run this command due to your server not being installed. Please run `/install`."
    );
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },
  ServerOffline: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Is Offline");
    embed.setDescription(
      "You cannot run this command due to your server being offline. Please run `/start`."
    );
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },
  CacheInUse: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Cache In Use");
    embed.setDescription(
      "The cache is in use! This could be due to a active backup or backup restore is running at this moment."
    );
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },

  // Install
  InstallSettingUp: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Installing server");
    embed.setDescription(
      "I am getting your server all setup! Please just give me a moment."
    );
    embed.setColor("Blue");

    interaction.editReply({ embeds: [embed] });
  },
  InstallSuccessful: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Install Complete");
    embed.setDescription("I have successfully installed your server!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },
  AlreadyInstalled: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Already Installed");
    embed.setDescription(
      "It seems that you are trying your server, even though your server already exists!"
    );
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },

  // Uninstall
  CancelledUninstall: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Cancelled Uninstall");
    embed.setDescription(
      "It seems like you did not type the exact words required, and the uninstallation of the server has been cancelled."
    );
    embed.setColor(Colors.Orange);

    interaction.editReply({ embeds: [embed] });
  },
  ServerUninstalled: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Uninstalled");
    embed.setDescription("Your server has been fully uninstalled!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },

  // Start
  ServerAlreadyOn: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Already On");
    embed.setDescription("Your server is currently online!");
    embed.setColor(Colors.Orange);

    interaction.editReply({ embeds: [embed] });
  },
  ServerStarted: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Started");
    embed.setDescription("Your server has been started!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },

  // Stop
  ServerAlreadyoff: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Already Off");
    embed.setDescription("Your server is already offline!");
    embed.setColor(Colors.Orange);

    interaction.editReply({ embeds: [embed] });
  },
  ServerStopped: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Server Stopped");
    embed.setDescription("Your server has been stopped!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },

  // Backup
  BackupInProcess: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Backing Up");
    embed.setDescription(
      "I am creating a new backup right now! Please just give me a few moments."
    );
    embed.setColor(Colors.Blue);

    interaction.editReply({ embeds: [embed] });
  },
  BackupCreated: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Backup Created");
    embed.setDescription("A backup has been successfully created!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },

  // ListBackups
  NoBackups: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("No Backups Found");
    embed.setDescription("Your server does not currently have any backups!");
    embed.setColor(Colors.Orange);

    interaction.editReply({ embeds: [embed] });
  },
  ViewBackups: (
    interaction: ChatInputCommandInteraction,
    backups: Backup[]
  ) => {
    const embed = baseResponse(interaction);
    const display = backups
      .sort((a, b) => b.unix - a.unix)
      .map((backup, index) => {
        return `Backup #${index + 1}:\nCreated: <t:${backup.unix}:R>\nFile: \`${
          backup.file
        }\``;
      })
      .join("\n\n");

    embed.setTitle(`${backups.length} Backups Found`);
    embed.setDescription(
      `Here are the backups that I have found:\n\n${display}`
    );
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },

  // RestoreBackup
  BackupNotFound: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle(`Backup Not Found`);
    embed.setDescription("I could not find the backup file that entered!");
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },
  RestoringBackup: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle(`Restoring Backup`);
    embed.setDescription("Restoring your backup, please wait a few moments.");
    embed.setColor(Colors.Blue);

    interaction.editReply({ embeds: [embed] });
  },
  BackupRestored: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle(`Backup Restored`);
    embed.setDescription("I successfully restored your backup!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },

  // Run
  SlashDetected: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Slash Detected");
    embed.setDescription(
      "You do not need to have a slash at the beginning of your command. Example: `say hello world!`"
    );
    embed.setColor(Colors.DarkRed);

    interaction.editReply({ embeds: [embed] });
  },
  CommandRan: (interaction: ChatInputCommandInteraction) => {
    const embed = baseResponse(interaction);

    embed.setTitle("Command Ran");
    embed.setDescription("Successfully ran your command to the server!");
    embed.setColor(Colors.Green);

    interaction.editReply({ embeds: [embed] });
  },
};

export default Replies;
