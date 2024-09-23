import { Box, Heading, Text } from '@chakra-ui/react';

export const Failure = () => {
  return (
    <Box textAlign="center" mt={20}>
      <Heading as="h1" color="red.500">
        Oops!
      </Heading>
      <Text mt={4} fontSize="xl">
        Something went wrong during the login process.
      </Text>
    </Box>
  );
};
