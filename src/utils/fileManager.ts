import * as fs from "fs";
import type { Sources } from "../types/fileManager";

export default class FileManager {
  public static Read<T>(path: Sources | string): T {
    const data = fs.readFileSync(path);

    return JSON.parse(data.toString());
  }
  public static Write<T>(path: Sources | string, data: Partial<T>): void {
    const dataString = JSON.stringify(data);

    fs.writeFileSync(path, dataString);
  }
  public static Exists(path: Sources | string): boolean {
    return fs.existsSync(path);
  }
  public static Delete(path: Sources | string): void {
    fs.rmSync(path, { recursive: true, force: true });
  }
  public static MakeDirectory(path: Sources | string): void {
    fs.mkdirSync(path);
  }
  public static Directory(path: Sources | string): string[] {
    return fs.readdirSync(path);
  }
}
