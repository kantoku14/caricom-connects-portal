import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register'; // Correct import path from App.tsx
import { Home } from '../src/pages/Home';
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
        <Box p={4}>
          <Navbar />
          <Box as="main" mt={8}>
            <Routes>
              {/* Updated to Routes for React Router v6 */}
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

// Updated Navbar component without login-related code
function Navbar() {
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
        <Link
          href="/register"
          _hover={{ textDecoration: 'none', color: 'teal.200' }}
        >
          Register
        </Link>
      </Flex>
    </Flex>
  );
}

export default App;
