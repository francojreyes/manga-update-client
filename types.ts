interface Instance {
  id: number;
  idx: number;
  name: string;
  imgSrc?: string;
}

type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

interface Chapter {
  chapterId: string;
  title: string | null;
  volume: string | null;
  chapter: string | null;
  readableAt: string;
}

interface Manga {
  id: string;
  cover: string;
  title: string;
  status: MangaStatus;
  latestChapter?: Chapter;
}

interface Guild {
  id: string;
  name: string | null;
  icon: string | null;
}

interface Webhook {
  id: string;
  token: string;
  name: string;
  avatar: string | null;
  guild: Guild;
  channelId: string;
}

interface Member {
  id: string;
  username: string;
  global_name: string;
  avatar: string | null;
  discriminator: string;
  is_owner: boolean;
}
