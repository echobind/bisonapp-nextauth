import React from 'react';
import { Box, Center, Flex, Text, Button } from '@chakra-ui/react';
import { signIn } from 'next-auth/client';

import { Logo } from '../components/Logo';

export function LoggedOutLayout({ children }) {
  return (
    <Flex direction="column" minH="100vh">
      <>
        <Flex p={4}>
          <Logo />

          <Button ml="auto" display={{ base: 'none', lg: 'inline-flex' }} onClick={() => signIn()}>
            Login
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
