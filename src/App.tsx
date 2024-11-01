import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';
import { Home } from './pages/Home';
import { LoginWelcome } from './components/LoginWelcome'; // Use LoginWelcome as the login page entry point
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';

export const App = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Box p={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginWelcome />} /> {/* Updated */}
              <Route path="/register" element={<Register />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failed" element={<Failure />} />
            </Routes>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};
