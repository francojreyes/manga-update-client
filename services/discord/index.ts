import { API } from "@discordjs/core";
import { REST } from "@discordjs/rest";
import NodeCache from "node-cache";

const createUserAPI = (access_token: string) => {
  const rest = new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(access_token);
  return new API(rest);
};

const getSelf = async (api: API) => {
  return api.users.getCurrent();
};

const getUser = async (api: API, userId: string) => {
  return api.users.get(userId);
};

const getSelfGuilds = async (api: API) => {
  return api.users.getGuilds();
};

const getGuild = async (api: API, guildId: string) => {
  try {
    return api.guilds.getWidget(guildId);
  } catch (e) {
    return null;
  }
};

type APIWebhook = Awaited<ReturnType<typeof API.prototype.webhooks.get>>;
const webhookCache = new NodeCache({ stdTTL: 300 });

const getWebhook = async (api: API, webhookId: string, webhookToken: string) => {
  const cacheKey = webhookId + "/" + webhookToken;
  const cached = webhookCache.get<APIWebhook>(cacheKey);
  if (cached) return cached;

  const webhook = api.webhooks.get(webhookId, { token: webhookToken });
  webhookCache.set(cacheKey, webhook);
  return webhook;
};

const service = {
  createUserAPI,
  getSelf,
  getUser,
  getSelfGuilds,
  getGuild,
  getWebhook,
};

export default service;
