import "server-only";
import { API } from "@discordjs/core";
import { REST } from "@discordjs/rest";

export const BOT_API = new API(
  new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN!)
);
