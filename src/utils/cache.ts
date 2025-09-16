import { Sources, type Config } from "../types/fileManager";
import FileManager from "./fileManager";

export default class Cache {
  public static Config: Config = FileManager.Read<Config>(Sources.CONFIG);
  public static Cooldowns: Record<string, Date> = {};
}
