import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';

import { createApolloClient } from '../lib/apolloClient';
import defaultTheme from '../chakra';

const defaultApolloClient = createApolloClient();

/**
 * Renders all context providers
 */
export function AllProviders({
  apolloClient = defaultApolloClient,
  theme = defaultTheme,
  children,
}) {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <CSSReset />

        {children}
      </ChakraProvider>
    </ApolloProvider>
  );
}
