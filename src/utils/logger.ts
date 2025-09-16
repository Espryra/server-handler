import chalk from "chalk";

export default class Logger {
  public static Info(...args: any[]) {
    console.log(
      this.Time(),
      chalk.gray("[") + chalk.blue("INFO") + chalk.gray("]"),
      ...this.Map(args)
    );
  }
  public static Warn(...args: any[]) {
    console.log(
      this.Time(),
      chalk.gray("[") + chalk.yellow("WARN") + chalk.gray("]"),
      ...this.Map(args)
    );
  }
  public static Error(...args: any[]) {
    console.log(
      this.Time(),
      chalk.gray("[") + chalk.red("ERROR") + chalk.gray("]"),
      ...this.Map(args)
    );

    process.exit(1);
  }
  public static Success(...args: any[]) {
    console.log(
      this.Time(),
      chalk.gray("[") + chalk.green("SUCCESS") + chalk.gray("]"),
      ...this.Map(args)
    );
  }
  public static Debug(...args: any[]) {
    console.log(
      this.Time(),
      chalk.gray("[") + chalk.magenta("DEBUG") + chalk.gray("]"),
      ...this.Map(args)
    );
  }

  private static Time(): string {
    return (
      chalk.gray("[") +
      chalk.yellow(new Date().toLocaleString()) +
      chalk.gray("]")
    );
  }
  private static Map(args: any[]): any[] {
    return args.map((arg) => {
      switch (typeof arg) {
        case "object":
          return chalk.magenta(JSON.stringify(arg));
        case "string":
          return arg;
        case "boolean":
          return arg === true ? chalk.green("true") : chalk.red("false");
        case "number":
          return chalk.yellow(arg);
        default:
          return arg;
      }
    });
  }
}
