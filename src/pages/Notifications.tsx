import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

export const NotificationsDetails = () => {
  return (
    <Box p={8} maxWidth="800px" mx="auto">
      <Heading as="h2" size="lg" mb={4}>
        Notifications Details
      </Heading>
      <Text>Here you will find a list of recent updates and alerts.</Text>
      {/* More notification details go here */}
    </Box>
  );
};
