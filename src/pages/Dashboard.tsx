import { Box, Heading, Text } from '@chakra-ui/react';

export const Dashboard = () => {
  return (
    <Box p={8}>
      <Heading>Welcome to Your Dashboard</Heading>
      <Text mt={4}>
        Here you can manage your account, access features, and review your
        recent activity.
      </Text>
      {/* Add more dashboard-specific content or components here */}
    </Box>
  );
};
