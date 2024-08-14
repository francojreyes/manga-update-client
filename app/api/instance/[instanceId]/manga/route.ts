import { auth } from "@/auth";
import db from "@/services/db";
import mangadex from "@/services/mangadex";
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
      { message: "You do not have permission to view this instance" },
      { status: 403 },
    );
  }

  const manga = await mangadex.getManyManga(instance.manga.map((manga) => manga.id));
  return NextResponse.json({ manga });
});

