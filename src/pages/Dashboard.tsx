// Dashboard.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Text,
  HStack,
  VStack,
  SimpleGrid,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.800')}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">CARICOM Connects</Heading>
        <HStack spacing={4}>
          <IconButton
            aria-label="Notifications"
            icon={<FaBell />}
            variant="ghost"
          />
          <Avatar src="https://bit.ly/ryan-florence" name={user?.name} />
        </HStack>
      </Flex>

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {/* User Profile Card */}
        <Box
          p={6}
          bg={useColorModeValue('white', 'gray.700')}
          shadow="md"
          borderRadius="md"
        >
          <VStack align="start">
            <Heading size="md">{user?.name}</Heading>
            <Text color="gray.500">{user?.prefs?.role}</Text>
          </VStack>
        </Box>

        {/* Current Time Card */}
        <Box
          p={6}
          bg={useColorModeValue('white', 'gray.700')}
          shadow="md"
          borderRadius="md"
        >
          <VStack align="start">
            <Heading size="sm">Current Time</Heading>
            <Text fontSize="lg">{format(currentTime, 'HH:mm:ss')}</Text>
            <Text color="gray.500">{format(currentTime, 'eeee, MMMM do')}</Text>
          </VStack>
        </Box>

        {/* Order History */}
        <Box
          p={6}
          bg={useColorModeValue('white', 'gray.700')}
          shadow="md"
          borderRadius="md"
        >
          <Heading size="sm" mb={4}>
            Order History
          </Heading>
          <VStack align="start" spacing={2}>
            <Text>Order #12345 - Completed</Text>
            <Text>Order #67890 - Pending</Text>
            <Text>Order #11223 - Shipped</Text>
          </VStack>
        </Box>

        {/* Market Trends */}
        <Box
          p={6}
          bg={useColorModeValue('white', 'gray.700')}
          shadow="md"
          borderRadius="md"
          gridColumn="span 2"
        >
          <Heading size="sm" mb={4}>
            Market Trends
          </Heading>
          <Text color="gray.500">
            Placeholder data for agricultural trends relevant to CARICOM.
          </Text>
        </Box>

        {/* Notifications */}
        <Box
          p={6}
          bg={useColorModeValue('white', 'gray.700')}
          shadow="md"
          borderRadius="md"
        >
          <Heading size="sm" mb={4}>
            Notifications
          </Heading>
          <VStack align="start" spacing={2}>
            <Text>System Update - Nov 10</Text>
            <Text>New Order Received</Text>
            <Text>Payment Reminder</Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};
