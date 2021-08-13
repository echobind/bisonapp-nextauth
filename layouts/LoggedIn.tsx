import React from 'react';
import { Box, Center, Flex, Text, Button } from '@chakra-ui/react';
import { signOut } from 'next-auth/client';
import { gql } from '@apollo/client';

import { Logo } from '../components/Logo';
import { Nav } from '../components/Nav';
import { useMeQuery } from '../types';

export const ME_QUERY = gql`
  query me {
    me {
      id
      email
    }
  }
`;

export function LoggedInLayout({ children }) {
  useMeQuery();

  return (
    <Flex direction="column" minH="100vh">
      <>
        <Flex p={4}>
          <Logo />

          <Nav />

          <Button ml={16} display={{ base: 'none', lg: 'inline-flex' }} onClick={() => signOut()}>
            Logout
          </Button>
        </Flex>
      </>

      <Box flex="1 1 auto" mt={8}>
        {children}
      </Box>

      <Center as="footer" mt="auto" py={4}>
        <Flex flexDirection="column" alignItems="center">
          <Logo />
          <Text as="i" textAlign="center">
            Copyright Ⓒ 2020{' '}
            <a href="https://echobind.com" target="_blank" rel="noopener noreferrer">
              Echobind LLC.
            </a>{' '}
            All rights reserved.
          </Text>
        </Flex>
      </Center>
    </Flex>
  );
}
