/**
 * Format a discord image hash into a filename
 *
 * Ref: https://discord.com/developers/docs/reference#image-formatting
 */
export default function imgHashToFilename(imgHash: string): string {
  return imgHash + imgHash.startsWith("a_") ? ".gif" : ".png";
}
