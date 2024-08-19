import { DefaultJWT } from "@auth/core/jwt";
import { calculateUserDefaultAvatarIndex, CDN } from "@discordjs/rest";
import NextAuth, { DefaultSession } from "next-auth";
import Discord, { DiscordProfile } from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    access_token: string;
    user: {
      discordId: string;
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    access_token: string;
    discordId: string;
    username: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord({
    async profile({ id, email, username, discriminator, global_name, avatar }: DiscordProfile) {
      const cdn = new CDN();
      const image = avatar
        ? cdn.avatar(id, avatar)
        : cdn.defaultAvatar(calculateUserDefaultAvatarIndex(discriminator));

      return { discordId: id, email, name: global_name, username, image };
    },
    authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
  })],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt({ token, user, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }

      if (user) { // User is available during sign-in
        Object.assign(token, user);
      }
      return token;
    },
    session({ session, token }) {
      session.access_token = token.access_token;
      session.user.discordId = token.discordId;
      session.user.username = token.username;
      return session;
    },
  },
});
