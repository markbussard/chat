import { NextResponse } from "next/server";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@repo/db";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture
        };
      }
    })
  ],
  callbacks: {
    jwt: ({ token }) => {
      return token;
    },
    session: ({ session, token }) => {
      if (typeof token.sub === "string") {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized: ({ auth, request }) => {
      const baseUrl = request.url;
      const pathname = request.nextUrl.pathname;

      const isAuthenticated = !!auth?.user?.id;

      if (!isAuthenticated && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", baseUrl));
      }

      if (isAuthenticated && pathname === "/login") {
        return NextResponse.redirect(new URL("/", baseUrl));
      }

      return NextResponse.next();
    }
  },
  events: {
    linkAccount: async ({ user }) => {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      });
    }
  }
};
