import { auth } from "@/auth";
import db from "@/services/db";
import discord from "@/services/discord";
import { BOT_API } from "@/services/discord/bot";
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

  const memberPromises: Promise<Member>[] = instance.members.map(
    (member) => discord.getUser(BOT_API, member.id)
      .then(({ id, username, avatar, discriminator, global_name }) => ({
        id,
        username,
        avatar,
        discriminator,
        global_name: global_name ?? username,
        is_owner: id === instance.ownerId,
      }))
  );

  return NextResponse.json({ members: await Promise.all(memberPromises) });
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

  if (instance.ownerId !== authUser.discordId) {
    return NextResponse.json(
      { message: "You do not own this instance" },
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

  await db.removeInstanceMember(instanceId, id);
  return NextResponse.json({});
});
