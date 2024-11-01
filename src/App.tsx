import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './pages/Register';
import { Success } from './pages/Success';
import { Failure } from './pages/Failure';
import { Home } from './pages/Home';
import { Verify } from './pages/Verify'; // Import Verify page
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
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<Verify />} /> {/* Verify Route */}
              <Route path="/success" element={<Success />} />
              <Route path="/failed" element={<Failure />} />
            </Routes>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};
