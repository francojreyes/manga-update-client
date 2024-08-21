/**
 * Parses a webhook URL for the id and token.
 */
export default function parseWebhookURL(url: string): { id: string, token: string } | null {
  const matches = url.match(
    /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i,
  );

  if (!matches || matches.length <= 2) return null;

  const [, id, token] = matches;
  return {
    id,
    token,
  };
}