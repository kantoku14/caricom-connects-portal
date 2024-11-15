import { Box, Heading, Text } from '@chakra-ui/react';

export const Success = () => {
  return (
    <Box textAlign="center" mt={20}>
      <Heading as="h1" color="teal.500">
        Success!
      </Heading>
      <Text mt={4} fontSize="xl">
        You have successfully signed in with Google.
      </Text>
    </Box>
  );
};
