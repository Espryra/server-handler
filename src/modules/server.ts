import { spawn, type ChildProcess } from "child_process";
import Cache from "../utils/cache";
import FileManager from "../utils/fileManager";
import Logger from "../utils/logger";

export default class Server {
  private static Instance: ChildProcess | undefined;

  public static Write(data: string): boolean {
    if (!this.Instance) {
      return false;
    }

    this.Instance.stdin?.write(Buffer.from(data + "\n"));

    return true;
  }
  public static Start(): boolean {
    if (this.Instance) {
      return false;
    }
    if (!FileManager.Exists(Cache.Config.root_path + "server")) {
      return false;
    }

    this.Instance = spawn("./bedrock_server", {
      cwd: Cache.Config.root_path + "server",
    });

    if (Cache.Config.show_console) {
      this.Instance.stdout?.on("data", (chunk: Buffer) => {
        console.log(chunk.toString());
      });
    }

    this.Instance.once("spawn", () => {
      Logger.Info("Server has started.");
    });
    this.Instance.once("exit", (code) => {
      Logger.Info("Server has exited on code", code);

      this.Instance = undefined;
    });

    return true;
  }

  public static get IsOnline(): boolean {
    return this.Instance !== undefined;
  }
}
