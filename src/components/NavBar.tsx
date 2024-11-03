import {
  Box,
  Flex,
  Button,
  Link,
  Spacer,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { triggerSessionInactive } from '../utils/message';
import { useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Trigger the logout function
      triggerSessionInactive(toast, null); // Show logout notification
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <Box bg="teal.500" color="white" px={4} py={3} boxShadow="md">
      <Flex alignItems="center" maxW="8xl" mx="auto">
        {/* Logo or Home Link */}
        <Link href="/" fontWeight="bold" fontSize="lg">
          Caricom Connects
        </Link>

        <Spacer />

        {/* Display user info and logout option if logged in */}
        {user ? (
          <>
            <Text mr={4}>Welcome, {user.name}</Text>
            <Button onClick={handleLogout} colorScheme="teal" variant="outline">
              Logout
            </Button>
          </>
        ) : (
          // Display Login and Register if not logged in
          <>
            <Button
              as={Link}
              href="/login"
              colorScheme="teal"
              variant="ghost"
              mr={2}
            >
              Login
            </Button>
            <Button
              as={Link}
              href="/register"
              colorScheme="teal"
              variant="solid"
            >
              Register
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};
