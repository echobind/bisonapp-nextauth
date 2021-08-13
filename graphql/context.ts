import { IncomingMessage } from 'http';

import { Context as ApolloContext } from 'apollo-server-core';
import { PrismaClient, User } from '@prisma/client';
import { getSession } from 'next-auth/client';

import { prisma } from '../lib/prisma';

/**
 * Populates a context object for use in resolvers.
 * If there is a valid auth token in the authorization header, it will add the user to the context
 * @param context context from apollo server
 */
export async function createContext(context: ApolloApiContext): Promise<Context> {
  const session = await getSession({ req: context.req });
  let user: User | null = null;

  if (session) {
    const sessionWithUser = await prisma.session.findUnique({
      where: { accessToken: session.accessToken as string },
      include: {
        user: true,
      },
    });

    user = sessionWithUser?.user;
  }

  return {
    db: prisma,
    prisma,
    user,
  };
}

type ApolloApiContext = ApolloContext<{ req: IncomingMessage }>;

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  user: User;
};
