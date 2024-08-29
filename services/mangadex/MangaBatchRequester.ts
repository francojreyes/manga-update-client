import { BASE_URL, CONTENT_RATINGS, throttledFetch } from "@/services/mangadex/constants";
import debounce from "lodash.debounce";

interface QueueItem {
  mangaId: string;
  resolve: (value: Manga | null | PromiseLike<Manga | null>) => void;
  reject: (reason?: any) => void;
}

class MangaBatchRequester {
  private queue: QueueItem[] = [];
  private readonly debouncedExecuteBatch: ReturnType<typeof debounce>;
  private readonly maxBatchSize: number;

  constructor(maxBatchSize: number = 100, maxWaitTime: number = 200) {
    this.maxBatchSize = maxBatchSize;
    this.debouncedExecuteBatch = debounce(this.executeBatch, maxWaitTime);
  }

  public request(mangaId: string): Promise<Manga | null> {
    return new Promise((resolve, reject) => {
      this.queue.push({ mangaId, resolve, reject });

      this.debouncedExecuteBatch();
      if (this.queue.length >= this.maxBatchSize) {
        this.debouncedExecuteBatch.flush();
      }
    })
  }

  private async executeBatch() {
    const batch = this.queue.slice(0, this.maxBatchSize);
    this.queue = this.queue.slice(this.maxBatchSize);

    console.debug("Requesting: " + batch.map(item => item.mangaId).join(", "));

    const params = new URLSearchParams();
    params.append("includes[]", "cover_art");
    for (const contentRating of CONTENT_RATINGS) {
      params.append("contentRating[]", contentRating);
    }

    params.append("limit", `${batch.length}`);
    for (const item of batch) {
      params.append("ids[]", item.mangaId);
    }

    try {
      const res = await throttledFetch(`${BASE_URL}/manga?${params}`)
      const json = await res.json();

      const data = Object.fromEntries(json.data.map((jsonManga: any) => [
        jsonManga.id,
        jsonToManga(jsonManga),
      ]));

      for (const { mangaId, resolve } of batch) {
        resolve(mangaId in data ? data[mangaId] : null);
      }
    } catch (e) {
      for (const { reject } of batch) {
        reject(e);
      }
    }
  }
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

export default MangaBatchRequester;
