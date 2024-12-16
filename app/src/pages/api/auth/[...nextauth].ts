import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import TwitterProvider, { TwitterProfile } from "next-auth/providers/twitter";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) throw new Error("Next auth secret is not set");

  const providers = [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        params: {
          scope: "tweet.read tweet.write users.read offline.access",
        },
      },
      profile: async (profile: TwitterProfile, tokens) => {
        return {
          id: profile.data.id,
          username: profile.data.username,
          image: profile.data.profile_image_url?.replace("_normal", ""),
          name: profile.data.name,
        };
      },
    }),
  ];

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret,
    callbacks: {
      jwt: async ({ token, account, user }) => {
        console.log("jwt", token, account, user);
        token.user = { ...(token as any).user, ...user };

        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;

        return token;
      },
      session: async ({ session, token }: { session: any; token: JWT }) => {
        console.log("session", session, token);

        session.user = token.user;
        session.twitterAccessToken = token.twitterAccessToken;
        session.twitterRefreshToken = token.twitterRefreshToken;

        return session;
      },
    },
  });
}
