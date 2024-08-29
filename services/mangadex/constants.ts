import pThrottle from "p-throttle";

export const BASE_URL = "https://api.mangadex.org";
export const CONTENT_RATINGS = ["safe", "suggestive", "erotica", "pornographic"];

const throttle = pThrottle({
  limit: 5,
  interval: 1000,
});
export const throttledFetch = throttle(fetch);
