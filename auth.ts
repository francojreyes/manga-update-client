import { DefaultJWT } from "@auth/core/jwt";
import NextAuth, { DefaultSession } from "next-auth";
import Discord, { DiscordProfile } from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord({
    async profile({ id, email, username, global_name, avatar }: DiscordProfile) {
      const fmt = avatar?.startsWith("a_") ? "gif" : "png";
      const image = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${fmt}`;
      return { id, email, name: global_name, username, image };
    }
  })],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        Object.assign(token, user);
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session
    },
  },
});
