
export default function displayChapter(volume: string | null, chapter: string): string {
  return volume ? `Volume ${volume}, Chapter ${chapter}` : `Chapter ${chapter}`;
}