import { spawn, type ChildProcess } from "child_process";
import type { RestartMessage } from "../types/fileManager";
import type { Backup } from "../types/server";
import Cache from "../utils/cache";
import FileManager from "../utils/fileManager";
import Logger from "../utils/logger";
import Sleep from "../utils/sleep";

export default class Server {
  private static Instance: ChildProcess | undefined;

  public static async Init(): Promise<void> {
    this.AutoBackups();
    this.AutoRestart();
  }

  public static get IsOnline(): boolean {
    return this.Instance !== undefined;
  }

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
  public static async Backup(): Promise<number> {
    const process = spawn("./backup.sh", {
      cwd: Cache.Config.root_path + "scripts",
      env: {
        rootpath: Cache.Config.root_path,
        cachepath: Cache.Config.root_path + "cache",
        serverpath: Cache.Config.root_path + "server",
        backuppath: Cache.Config.root_path + "backups",
        backupitems: Cache.Config.backup_items.join(" "),
        filename: new Date().toISOString() + ".tar.gz",
      },
    });

    return new Promise<number>((resolve) => {
      process.once("exit", (code) => {
        if (code === 0) {
          Logger.Info("Created a new backup!");
        }

        resolve(code ?? 0);
      });
    });
  }

  public static Backups(): Backup[] {
    if (!FileManager.Exists(Cache.Config.root_path + "backups")) {
      FileManager.MakeDirectory(Cache.Config.root_path + "backups");
    }

    return FileManager.Directory(Cache.Config.root_path + "backups").map(
      (file) => {
        return {
          file,
          unix: Math.floor(
            new Date(file.replace(".tar.gz", "")).getTime() / 1000
          ),
        };
      }
    );
  }

  private static AutoBackups(): void {
    setInterval(async () => {
      if (!FileManager.Exists(Cache.Config.root_path + "server")) {
        return;
      }
      if (!Server.IsOnline) {
        return;
      }

      await this.Backup();

      const backups = this.Backups().sort((a, b) => b.unix - a.unix);

      if (Cache.Config.backup_retention === 0) {
        return;
      }

      const overload = backups.slice(
        Cache.Config.backup_retention,
        backups.length
      );

      for (const entry of overload) {
        FileManager.Delete(Cache.Config.root_path + "backups/" + entry.file);
      }
    }, Cache.Config.backup_speed * 1000 * 60);
  }
  private static AutoRestart(): void {
    const messages = Cache.Config.restart_messages;

    if (Cache.Config.restart_times.length === 0) {
      return;
    }

    setInterval(async () => {
      const time = new Date();
      const hours = time.getHours();
      const minutes = time.getMinutes();

      if (
        !Cache.Config.restart_times.includes(
          `${hours}:${String(minutes).padStart(1, "0")}`
        )
      ) {
        return;
      }
      if (!this.Instance) {
        return;
      }

      for (let i = 0; i < messages.length; i++) {
        const entry = messages[i] as RestartMessage;

        this.Write(`tellraw @a {"rawtext":[{"text":"${entry.message}"}]}`);

        for (const command of entry.commands) {
          this.Write(command);
        }

        await Sleep(entry.time * 1000);
      }

      this.Write("stop");

      const loop = setInterval(() => {
        if (this.Instance) {
          return;
        }

        clearInterval(loop);
        this.Start();
      }, 1000);
    }, 1000 * 60);
  }
}
