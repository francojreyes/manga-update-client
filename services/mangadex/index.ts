import pThrottle from "p-throttle";
import NodeCache from "node-cache";

const BASE_URL = "https://api.mangadex.org";
const CONTENT_RATINGS = ["safe", "suggestive", "erotica", "pornographic"];

const throttle = pThrottle({
  limit: 5,
  interval: 1000,
});
const throttledFetch = throttle(fetch);

const mangaCache = new NodeCache({ stdTTL: 3600 });

const getManga = async (mangaId: string): Promise<Manga | null> => {
  const cached: Manga | undefined = mangaCache.get(mangaId);
  if (cached) return cached;

  const params = new URLSearchParams();
  params.append("includes[]", "cover_art");
  const res = await fetch(`${BASE_URL}/manga/${mangaId}?${params}`);
  if (!res.ok) return null;

  const json = await res.json();
  const manga = jsonToManga(json.data);
  mangaCache.set(mangaId, manga);
  return manga;
}

const jsonToManga = (json: any): Manga => {
  const cover = json.relationships.find((rel: any) => rel.type === "cover_art");
  return {
    id: json.id,
    cover: `https://uploads.mangadex.org/covers/${json.id}/${cover.attributes.fileName}.256.jpg`,
    title: json.attributes.title.en,
    status: json.attributes.status,
  };
};

const getManyManga = async (mangaIds: string[]): Promise<{
  [mangaId: string]: Manga
}> => {
  const res: { [mangaId: string]: Manga } = mangaCache.mget(mangaIds);

  const toFetch = mangaIds.filter((id) => !(id in res));
  const fetchPromises = [];
  for (let i = 0; i < toFetch.length; i += 100) {
    const params = new URLSearchParams();
    params.append("includes[]", "cover_art");
    for (const contentRating of CONTENT_RATINGS) {
      params.append("contentRating[]", contentRating);
    }

    const batch = toFetch.slice(i, i + 100);
    params.append("limit", `${batch.length}`);
    for (const mangaId of batch) {
      params.append("ids[]", mangaId);
    }

    fetchPromises.push(
      throttledFetch(`${BASE_URL}/manga?${params}`)
        .then((res) => res.json()),
    );
  }

  const responses = await Promise.all(fetchPromises);
  const fetched = responses.flatMap((json) => json.data).map(jsonToManga);
  for (const manga of fetched) {
    mangaCache.set(manga.id, manga);
    res[manga.id] = manga;
  }

  return res;
};

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
  getManyManga,
  getLatestChapter,
};

export default service;
