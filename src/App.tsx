import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/NavBar';

export const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box p={4}>
            <Navbar />
            <Box as="main" mt={8}>
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};
