
interface Instance {
  id: number;
  idx: number;
  name: string;
  imgSrc?: string;
}

type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled";

interface Manga {
  id: string;
  cover: string;
  name: string;
  status: MangaStatus;
}
