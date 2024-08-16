import { auth } from "@/auth";

import db from "@/services/db";
import mangadex from "@/services/mangadex";
import { NextResponse } from "next/server";

export const GET = auth(async (req, { params }) => {
  const mangaId = params!.mangaId as string;
  const language = req.nextUrl.searchParams.get("language") ?? "en";

  const dbRes = await db.getLatestChapter(mangaId, language);
  if (dbRes) {
    return NextResponse.json(dbRes);
  }

  const mangadexRes = await mangadex.getLatestChapter(mangaId, language);
  if (!mangadexRes) {
    return NextResponse.json({ message: "No chapters found" }, { status: 404 });
  }

  await db.cacheLatestChapter(mangaId, language, mangadexRes);
  return NextResponse.json(mangadexRes);
});