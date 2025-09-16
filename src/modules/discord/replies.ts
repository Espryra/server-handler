import {
  Colors,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

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
};

export default Replies;
