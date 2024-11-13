// Dashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  useBreakpointValue,
  Stack,
  Avatar,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'PPpp'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Welcome to Your Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {/* User Profile Card */}
        <Box
          p={6}
          border="1px solid"
          borderRadius="md"
          minHeight="200px"
          onClick={() => isMobile && handleNavigate('/profile')}
          _hover={{ cursor: isMobile ? 'pointer' : 'auto' }}
        >
          <Heading size="md" mb={4}>
            Your Profile
          </Heading>
          <Stack direction="row" alignItems="center" mb={4}>
            <Avatar src="https://bit.ly/ryan-florence" size="lg" />
            <Box>
              <Text fontWeight="bold">{user?.name}</Text>
              <Text>{user?.prefs.role}</Text>
            </Box>
          </Stack>
          <Text>Email: {user?.email}</Text>
          {!isMobile && (
            <Button
              mt={4}
              colorScheme="yellow"
              onClick={() => handleNavigate('/profile')}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Order History Card */}
        <Box
          p={6}
          border="1px solid"
          borderRadius="md"
          minHeight="300px"
          onClick={() => isMobile && handleNavigate('/order-history')}
          _hover={{ cursor: isMobile ? 'pointer' : 'auto' }}
        >
          <Heading size="md" mb={4}>
            Order History
          </Heading>
          <Text>Here’s a summary of your recent orders:</Text>
          <Stack spacing={3} mt={4}>
            <Text>Order #1: Shipped</Text>
            <Text>Order #2: In Transit</Text>
            <Text>Order #3: Delivered</Text>
            <Text>Order #4: Processing</Text>
          </Stack>
          {!isMobile && (
            <Button
              mt={4}
              colorScheme="yellow"
              onClick={() => handleNavigate('/order-history')}
            >
              View Details
            </Button>
          )}
        </Box>

        {/* Market Trends Card */}
        <Box
          p={6}
          border="1px solid"
          borderRadius="md"
          minHeight="200px"
          onClick={() => isMobile && handleNavigate('/market-trends')}
          _hover={{ cursor: isMobile ? 'pointer' : 'auto' }}
        >
          <Heading size="md" mb={4}>
            Market Trends
          </Heading>
          <Text>Agricultural market updates:</Text>
          <Stack spacing={3} mt={4}>
            <Text>Mangoes: Prices rising due to demand</Text>
            <Text>Bananas: Stable</Text>
            <Text>Cocoa: Slight increase in prices</Text>
            <Text>Coffee: Decrease in supply affecting prices</Text>
          </Stack>
          {!isMobile && (
            <Button
              mt={4}
              colorScheme="yellow"
              onClick={() => handleNavigate('/market-trends')}
            >
              View Details
            </Button>
          )}
        </Box>

        {/* Current Time Card */}
        <Box p={6} border="1px solid" borderRadius="md" minHeight="150px">
          <Heading size="md" mb={4}>
            Current Time
          </Heading>
          <Text fontSize="lg" fontWeight="bold">
            {currentTime}
          </Text>
        </Box>

        {/* Notifications Card */}
        <Box
          p={6}
          border="1px solid"
          borderRadius="md"
          minHeight="250px"
          onClick={() => isMobile && handleNavigate('/notifications')}
          _hover={{ cursor: isMobile ? 'pointer' : 'auto' }}
        >
          <Heading size="md" mb={4}>
            Notifications
          </Heading>
          <Stack spacing={3}>
            <Text>New market trends available</Text>
            <Text>Order #4 is now shipped</Text>
            <Text>Profile updated successfully</Text>
            <Text>Special discount on bulk orders</Text>
          </Stack>
          {!isMobile && (
            <Button
              mt={4}
              colorScheme="yellow"
              onClick={() => handleNavigate('/notifications')}
            >
              View Details
            </Button>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
};
