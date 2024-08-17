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

  const latestChaptersById = Object.fromEntries(
    instance.manga.map((manga) => [manga.id, manga.latestChapters[0]])
  );
  const mangaById = await mangadex.getManyManga(instance.manga.map((manga) => manga.id));

  const manga: Manga[] = instance.manga
    .map((manga) => {
      const latestChapter = latestChaptersById[manga.id];
      return {
        ...mangaById[manga.id],
        latestChapter: latestChapter
          ? {
            chapterId: latestChapter.chapterId,
            volume: latestChapter.volume,
            chapter: latestChapter.chapter,
            title: latestChapter.title,
            readableAt: latestChapter.readableAt.toISOString()
          }
          : undefined
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return NextResponse.json({ manga });
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
      { message: "You do not have permission to edit this instance" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const mangaId = body.mangaId;
  if (typeof mangaId !== "string") {
    return NextResponse.json(
      { message: "Invalid mangaId provided" },
      { status: 400 },
    );
  }

  await db.addInstanceManga(instanceId, mangaId);
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
      { message: "You do not have permission to edit this instance" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const mangaId = body.mangaId;
  if (typeof mangaId !== "string") {
    return NextResponse.json(
      { message: "Invalid mangaId provided" },
      { status: 400 },
    );
  }

  await db.removeInstanceManga(instanceId, mangaId);
  return NextResponse.json({});
});