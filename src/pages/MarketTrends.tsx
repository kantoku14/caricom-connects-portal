import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

export const MarketTrendsDetails = () => {
  return (
    <Box p={8} maxWidth="800px" mx="auto">
      <Heading as="h2" size="lg" mb={4}>
        Market Trends Details
      </Heading>
      <Text>Here you will find detailed insights on agricultural trends.</Text>
      {/* More market trend details go here */}
    </Box>
  );
};
