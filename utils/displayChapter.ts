
export default function displayChapter(volume: string | null, chapter: string): string {
  if (chapter === "Oneshot") return chapter;
  return volume ? `Volume ${volume}, Chapter ${chapter}` : `Chapter ${chapter}`;
}