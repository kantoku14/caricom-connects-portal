import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Center,
  Stack,
  Divider,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { user } = useAuth(); // Access the user state to determine if a user is logged in
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/register');
  const handleLogin = () => navigate('/login');

  return (
    <Box p={8} bg={useColorModeValue('gray.50', 'gray.800')} minH="100vh">
      <Center>
        <VStack spacing={8} textAlign="center" maxW="lg">
          <Heading size="2xl">Welcome to Caricom Connects!</Heading>
          <Text fontSize="lg" color="gray.500">
            Join a thriving network of individuals and businesses across the
            Caribbean. Connect, trade, and share knowledge on our unified
            platform.
          </Text>

          {!user ? (
            // Show these buttons if the user is not logged in
            <HStack spacing={4}>
              <Button colorScheme="teal" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button
                variant="outline"
                colorScheme="teal"
                onClick={handleLogin}
              >
                Already a Member?
              </Button>
            </HStack>
          ) : (
            // Welcome message if the user is logged in
            <Text fontSize="xl" color="teal.600">
              Welcome back, {user.name}! Explore the latest connections and
              opportunities.
            </Text>
          )}

          <Divider my={6} />

          <Stack spacing={4} textAlign="left">
            <Heading size="md">Why Join Caricom Connects?</Heading>
            <List spacing={3}>
              <ListItem>
                🌍 Connect with like-minded individuals across the Caribbean
              </ListItem>
              <ListItem>
                📈 Grow your business through networking and shared resources
              </ListItem>
              <ListItem>
                💼 Access exclusive trade opportunities and insights
              </ListItem>
              <ListItem>
                📚 Share and gain knowledge to stay ahead in your field
              </ListItem>
              <ListItem>🛠️ Tools and resources to help you succeed</ListItem>
            </List>
          </Stack>

          <Divider my={6} />

          <Stack spacing={4} textAlign="center">
            <Heading size="sm" color="gray.600">
              Ready to Take the Next Step?
            </Heading>
            <Text fontSize="md" color="gray.500">
              Whether you’re just getting started or expanding your network,
              Caricom Connects is here to support you every step of the way.
            </Text>
          </Stack>
        </VStack>
      </Center>
    </Box>
  );
};
