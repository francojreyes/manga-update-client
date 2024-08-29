import { BASE_URL, CONTENT_RATINGS, throttledFetch } from "@/services/mangadex/constants";
import MangaBatchRequester from "@/services/mangadex/MangaBatchRequester";

const mangaRequester = new MangaBatchRequester();

const getManga = async (mangaId: string): Promise<Manga | null> => {
  return mangaRequester.request(mangaId);
}

const getLatestChapter = async (mangaId: string, language: string): Promise<Chapter | null> => {
  const params = new URLSearchParams();
  params.append("limit", "1");
  for (const contentRating of CONTENT_RATINGS) {
    params.append("contentRating[]", contentRating);
  }
  params.append("translatedLanguage[]", language);
  params.append("includeFutureUpdates", "0");
  params.append("order[readableAt]", "desc");
  params.append("order[volume]", "desc");
  params.append("order[chapter]", "desc");

  const res = await throttledFetch(`${BASE_URL}/manga/${mangaId}/feed?${params}`)
    .then((res) => res.json());
  if (!res.data.length) return null;

  const chapter = res.data[0];
  return {
    chapterId: chapter.id,
    title: chapter.attributes.title,
    volume: chapter.attributes.volume,
    chapter: chapter.attributes.chapter,
    readableAt: chapter.attributes.readableAt,
  }
}

const service = {
  getManga,
  getLatestChapter,
};

export default service;
