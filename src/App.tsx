import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from '../src/pages/Login';
import { Register } from './pages/Register'; // Correct import path from App.tsx
import { Home } from '../src/pages/Home';
import { AuthProvider, useAuth } from './context/AuthContext'; // Updated to reflect AuthContext
import {
  ChakraProvider,
  Box,
  Flex,
  Link,
  Text,
  Button,
} from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          {' '}
          {/* Updated to use AuthProvider */}
          <Box p={4}>
            <Navbar />
            <Box as="main" mt={8}>
              <Routes>
                {' '}
                {/* Updated to Routes for React Router v6 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </Box>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

// Updated Navbar component to use useAuth from AuthContext
function Navbar() {
  const { current: user, logout } = useAuth(); // Correctly accessing the user and logout

  return (
    <Flex
      as="nav"
      justify="space-between"
      align="center"
      p={4}
      bg="teal.500"
      color="white"
    >
      <Link href="/" _hover={{ textDecoration: 'none', color: 'teal.200' }}>
        CARICOM Connects
      </Link>
      <Flex align="center">
        {user ? (
          <>
            <Text mr={4}>{user.email}</Text>{' '}
            {/* Display logged-in user's email */}
            <Button colorScheme="teal" variant="outline" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              mr={4}
              _hover={{ textDecoration: 'none', color: 'teal.200' }}
            >
              Login
            </Link>
            <Link
              href="/register"
              _hover={{ textDecoration: 'none', color: 'teal.200' }}
            >
              Register
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default App;
