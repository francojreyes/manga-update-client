import "server-only";

import { auth } from "@/auth";
import db from "@/services/db";
import discord from "@/services/discord";

/**
 * Cache the guilds of the currently authenticated user. Should not be done very
 * often.
 */
const cacheUserGuilds = async () => {
  const session = await auth();
  if (!session) return;

  const userAPI = discord.createUserAPI(session.access_token);
  const guilds = await discord.getSelfGuilds(userAPI);

  await db.cacheGuilds(guilds);
}

export default cacheUserGuilds;