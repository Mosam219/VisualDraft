import Google from 'next-auth/providers/google';
import { DefaultSession, getServerSession, NextAuthOptions } from 'next-auth';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    userRole?: 'admin';
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string;
    } & DefaultSession['user'];
  }
}

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  providers: [
    Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthOptions;

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

// We recommend doing your own environment variable validation
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
    }
  }
}
