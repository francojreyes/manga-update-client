import { auth } from "@/auth";
import db from "@/services/db";
import mangadex from "@/services/mangadex";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const fetchManga = unstable_cache(mangadex.getManga, [], { revalidate: 3600 });

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

  const mangaPromises: Promise<Manga | null>[] = instance.manga
    .map(async (manga) => {
      const fetchedManga = await fetchManga(manga.id);
      if (!fetchedManga) return null;

      const latestChapter = manga.latestChapters[0];
      return {
        ...fetchedManga,
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

  const manga: Manga[] = (await Promise.all(mangaPromises))
    .filter((maybeManga) => maybeManga !== null)
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
      { message: "You do not have access to this instance" },
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
      { message: "You do not have access to this instance" },
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