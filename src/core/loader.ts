import Discord from "../modules/discord/main";
import Server from "../modules/server";
import Cache from "../utils/cache";

await Cache.Init();
await Discord.Init();
await Server.Init();
