import { auth } from "@/auth";
import db from "@/services/db";
import discord from "@/services/discord";
import { NextResponse } from "next/server";

export const GET = auth(async (req, { params }) => {
  const authUser = req.auth?.user;
  if (!authUser) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const instanceId = parseInt(params?.instanceId as string);
  const instance = await db.getInstance(+instanceId);
  if (!instance) {
    return NextResponse.json(
      { message: `No instance with id ${params?.instanceId}` },
      { status: 404 },
    );
  }

  if (!instance.members.find((member) => member.id === authUser.discordId)) {
    return NextResponse.json(
      { message: "You do not have access to this instance" },
      { status: 403 },
    );
  }

  return NextResponse.json({ webhooks: instance.webhooks });
});

export const POST = auth(async (req, { params }) => {
  const authUser = req.auth?.user;
  if (!authUser) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const instanceId = parseInt(params?.instanceId as string);
  const instance = await db.getInstance(+instanceId);
  if (!instance) {
    return NextResponse.json(
      { message: `No instance with id ${params?.instanceId}` },
      { status: 404 },
    );
  }

  if (!instance.members.find((member) => member.id === authUser.discordId)) {
    return NextResponse.json(
      { message: "You do not have access to this instance" },
      { status: 403 },
    );
  }

  const { id, token } = await req.json();
  if (typeof id !== "string" || typeof token !== "string") {
    return NextResponse.json(
      { message: "Invalid id or token provided" },
      { status: 400 },
    );
  }

  const userAPI = discord.createUserAPI(req.auth!.access_token);
  const webhook = await discord.getWebhook(userAPI, id, token);

  await db.addInstanceWebhook(instanceId, {
    id: webhook.id,
    token: webhook.token!,
    name: webhook.name!,
    avatar: webhook.avatar,
    guild: { id: webhook.guild_id!, name: null, icon: null },
    channelId: webhook.channel_id!,
  });
  return NextResponse.json({});
});

export const DELETE = auth(async (req, { params }) => {
  const authUser = req.auth?.user;
  if (!authUser) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const instanceId = parseInt(params?.instanceId as string);
  const instance = await db.getInstance(+instanceId);
  if (!instance) {
    return NextResponse.json(
      { message: `No instance with id ${params?.instanceId}` },
      { status: 404 },
    );
  }

  if (!instance.members.find((member) => member.id === authUser.discordId)) {
    return NextResponse.json(
      { message: "You do not have access to this instance" },
      { status: 403 },
    );
  }

  const { id } = await req.json();
  if (typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid id provided" },
      { status: 400 },
    );
  }

  await db.removeInstanceWebhook(instanceId, id);
  return NextResponse.json({});
});