export enum Sources {
  CONFIG = "lib/config.json",
}

export interface Config {
  show_console: boolean;

  root_path: string;

  discord_cooldown: number;
  discord_allowed_users: string[];
  discord_console_channel: string;
  discord_console_speed: number;
  discord_console_lines: number;

  restart_times: string[];
  restart_messages: RestartMessage[];

  backup_speed: number;
  backup_retention: number;
  backup_items: string[];
}
export interface RestartMessage {
  message: string;
  time: number;
  commands: string[];
}
