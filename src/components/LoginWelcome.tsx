import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  Center,
} from '@chakra-ui/react';
import { Logo } from '../components/Logo';
import { Login } from '../pages/Login';

export const LoginWelcome = () => (
  <Flex
    minH={{ base: 'auto', md: '100vh' }}
    bgGradient={{
      md: 'linear(to-r, teal.500 50%, bg.surface 50%)', // Teal background on left
    }}
  >
    <Flex maxW="8xl" mx="auto" width="full">
      <Box flex="1" display={{ base: 'none', md: 'block' }}>
        <Flex
          direction="column"
          px={{ base: '4', md: '8' }}
          height="full"
          color="white" // Set text color to white
          bg="teal.500" // Teal background color for the left side
        >
          <Flex align="center" h="24">
            <Logo />
          </Flex>
          <Flex flex="1" align="center">
            <Stack spacing="8">
              <Stack spacing="6">
                <Heading size={{ md: 'lg', xl: 'xl' }} color="white">
                  Join the CARICOM Connects Network
                </Heading>
                <Text
                  textStyle="lg"
                  maxW="md"
                  fontWeight="medium"
                  color="whiteAlpha.800" // Slightly muted white color for contrast
                >
                  This portal is the only place where we can truly unite, trade,
                  and share knowledge. Be a part of our community.
                </Text>
              </Stack>
              <HStack spacing="4">
                <AvatarGroup
                  size="md"
                  max={useBreakpointValue({ base: 2, lg: 5 })}
                  borderColor="white"
                >
                  <Avatar
                    name="Ryan Florence"
                    src="https://bit.ly/ryan-florence"
                  />
                  <Avatar
                    name="Segun Adebayo"
                    src="https://bit.ly/sage-adebayo"
                  />
                  <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                  <Avatar
                    name="Prosper Otemuyiwa"
                    src="https://bit.ly/prosper-baba"
                  />
                  <Avatar
                    name="Christian Nwamba"
                    src="https://bit.ly/code-beast"
                  />
                </AvatarGroup>
                <Text fontWeight="medium" color="white">
                  Join 10,000+ users
                </Text>
              </HStack>
            </Stack>
          </Flex>
          <Flex align="center" h="24">
            <Text color="whiteAlpha.700" textStyle="sm">
              © 2024 CARICOM Connects. All rights reserved.
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Center flex="1">
        <Login
          px={{ base: '4', md: '8' }}
          py={{ base: '12', md: '48' }}
          width="full"
          maxW="md"
        />
      </Center>
    </Flex>
  </Flex>
);
