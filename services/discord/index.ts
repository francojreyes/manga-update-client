import { REST } from '@discordjs/rest';
import { API, Routes } from "@discordjs/core";

const createUserAPI = (access_token: string) => {
  const rest = new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(access_token);
  return new API(rest);
}

const getSelf = async (api: API) => {
  return api.users.getCurrent();
}

const getUser = async (api: API, userId: string) => {
  return api.users.get(userId);
}

const getSelfGuilds = async (api: API) => {
  return api.users.getGuilds();
}

const getGuild = async (api: API, guildId: string) => {
  try {
    return api.guilds.getWidget(guildId);
  } catch (e) {
    return null;
  }
}

const getWebhook = async (api: API, webhookId: string, webhookToken: string) => {
  return api.webhooks.get(webhookId, { token: webhookToken });
}

const service = {
  createUserAPI,
  getSelf,
  getUser,
  getSelfGuilds,
  getGuild,
  getWebhook,
};

export default service;
