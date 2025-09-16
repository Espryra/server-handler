export enum Sources {
  CONFIG = "lib/config.json",
}

export interface Config {
  show_console: boolean;

  root_path: string;

  discord_cooldown: number;

  backup_speed: number;
  backup_retention: number;
  backup_items: string[];
}
