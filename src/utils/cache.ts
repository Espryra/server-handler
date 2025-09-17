import { Sources, type Config } from "../types/fileManager";
import FileManager from "./fileManager";

export default class Cache {
  public static Config: Config = FileManager.Read<Config>(Sources.CONFIG);
  public static Cooldowns: Record<string, Date> = {};

  public static async Init(): Promise<void> {
    this.AutoUpdate();
  }

  private static AutoUpdate(): void {
    setInterval(() => {
      try {
        this.Config = FileManager.Read<Config>(Sources.CONFIG);
      } catch {}
    }, 1000);
  }
}
