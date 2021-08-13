/* eslint-disable no-restricted-globals */
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export function createApolloClient(ctx?: Record<string, any>) {
  // Apollo needs an absolute URL when in SSR, so determine host
  let host, protocol;
  let hostUrl = process.env.API_URL;

  if (ctx) {
    host = ctx?.req.headers['x-forwarded-host'];
    protocol = ctx?.req.headers['x-forwarded-proto'] || 'http';
    hostUrl = `${protocol}://${host}`;
  } else if (typeof location !== 'undefined') {
    host = location.host;
    protocol = location.protocol;
    hostUrl = `${protocol}//${host}`;
  }

  const uri = `${hostUrl}/api/graphql`;

  const httpLink = createHttpLink({
    uri,
    fetch,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  return client;
}
