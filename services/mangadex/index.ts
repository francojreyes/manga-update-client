import pThrottle from "p-throttle";

const BASE_URL = "https://api.mangadex.org";
const CONTENT_RATINGS = ["safe", "suggestive", "erotica", "pornographic"];

const throttle = pThrottle({
  limit: 5,
  interval: 1000,
});
const throttledFetch = throttle(fetch);

const getManyManga = async (mangaIds: string[]): Promise<{
  [mangaId: string]: Manga
}> => {
  const resPromises = [];
  for (let i = 0; i < mangaIds.length; i += 100) {
    const params = new URLSearchParams();
    params.append("includes[]", "cover_art");
    for (const contentRating of CONTENT_RATINGS) {
      params.append("contentRating[]", contentRating);
    }

    const batch = mangaIds.slice(i, i + 100);
    params.append("limit", `${batch.length}`);
    for (const mangaId of batch) {
      params.append("ids[]", mangaId);
    }

    resPromises.push(
      throttledFetch(`${BASE_URL}/manga?${params}`)
        .then((res) => res.json()),
    );
  }

  const responses = await Promise.all(resPromises);
  return Object.fromEntries(
    responses
      .flatMap((json) => json.data)
      .map((manga) => {
        const cover = manga.relationships.find((rel: any) => rel.type === "cover_art");
        return {
          id: manga.id,
          cover: `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`,
          title: manga.attributes.title.en,
          status: manga.attributes.status,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((manga) => [manga.id, manga])
  );
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
    volume: chapter.attributes.volume,
    chapter: chapter.attributes.chapter,
    readableAt: chapter.attributes.readableAt,
  }
}

const service = {
  getManyManga,
  getLatestChapter,
};

export default service;
