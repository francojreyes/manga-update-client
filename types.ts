
interface Instance {
  id: number;
  idx: number;
  name: string;
  imgSrc?: string;
}

type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

interface Chapter {
  chapterId: string;
  volume: string | null;
  chapter: string;
  readableAt: string;
}

interface Manga {
  id: string;
  cover: string;
  title: string;
  status: MangaStatus;
  latestChapter?: Chapter;
}
