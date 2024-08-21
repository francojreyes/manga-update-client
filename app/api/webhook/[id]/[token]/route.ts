import { auth } from "@/auth";
import db from "@/services/db";
import discord from "@/services/discord";
import { NextResponse } from "next/server";

export const GET = auth(async (req, { params }) => {
  const session = req.auth;
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const id = params?.id;
  const token = params?.token;
  if (typeof id !== "string" || typeof token !== "string") {
    return NextResponse.json(
      { message: "Invalid id or token provided" },
      { status: 400 },
    );
  }

  const userAPI = discord.createUserAPI(session.access_token);
  let apiWebhook;
  try {
    apiWebhook = await discord.getWebhook(userAPI, id, token);
  } catch (e) {
    return NextResponse.json(`${e}`, { status: 404 });
  }
  const apiGuild = await db.getGuild(apiWebhook.guild_id!);

  const webhook: Webhook = {
    id,
    token,
    name: apiWebhook.name!,
    avatar: apiWebhook.avatar,
    channelId: apiWebhook.channel_id,
    guild: {
      id: apiGuild.id,
      name: apiGuild.name,
      icon: apiGuild.icon,
    }
  };

  return NextResponse.json(webhook);
})