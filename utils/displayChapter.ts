
export default function displayChapter(chapter: Chapter): string {
  const { title, volume, chapter: chapterNum } = chapter;
  if (!volume && !chapterNum) return title ?? "Untitled Chapter";
  return volume ? `Volume ${volume}, Chapter ${chapterNum}` : `Chapter ${chapterNum}`;
}
